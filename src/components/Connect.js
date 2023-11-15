import { useAccount, useConnect } from 'wagmi'
import { useIsMounted } from '../hooks'

export const Connect = () => {
    // Hook personnalisé pour vérifier si le composant est monté
    const isMounted = useIsMounted()
    // Hooks pour gérer l'état du compte utilisateur et la connexion
    const { connector, isReconnecting } = useAccount()
    const { connect, connectors, isLoading, error, pendingConnector } =
        useConnect()

    return (
        <div>
            <div>
                {/* Afficher les boutons de connexion pour chaque connecteur disponible */}
                {connectors.map((x) => (
                    <button
                        // Désactiver le bouton si le connecteur n'est pas prêt, si la reconnexion est en cours, ou si le connecteur est déjà actif
                        disabled={!x.ready || isReconnecting || connector?.id === x.id}
                        type='button'
                        key={x.name}
                        // Déclencher la connexion avec le connecteur correspondant lors du clic sur le bouton
                        onClick={() => connect({ connector: x })}
                    >
                        {/* Afficher le nom du connecteur, sauf s'il s'agit du connecteur injecté (Metamask, etc.) */}
                        {x.id === 'injected' ? (isMounted ? x.name : x.id) : x.name}
                        {/* Afficher "(non pris en charge)" si le composant est monté et le connecteur n'est pas prêt */}
                        {isMounted && !x.ready && ' (unsupported)'}
                        {/* Afficher une indication de chargement si la connexion est en cours avec ce connecteur */}
                        {isLoading && x.id === pendingConnector?.id && '…'}
                    </button>
                ))}
            </div>

            <div>{error?.message}</div>
        </div>
    )
}