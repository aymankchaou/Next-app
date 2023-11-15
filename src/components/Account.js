import { useAccount, useBalance, useDisconnect, useEnsName, useSendTransaction } from 'wagmi'
import { useState } from "react";
const Moralis = require("moralis").default;
const { EvmChain } = require("@moralisweb3/common-evm-utils");
import { useIsMounted } from '../hooks'

export const Account = () => {
    // Hook personnalisé pour vérifier si le composant est monté
    const isMounted = useIsMounted()
    // Hook personnalisé pour obtenir les informations du compte utilisateur
    const account = useAccount({
        onConnect: (data) => console.log('connected', data),
        onDisconnect: () => console.log('disconnected'),
    })
    // Variables d'état pour gérer les valeurs d'entrée du formulaire et le résultat de la transaction
    const [to, setTo] = useState('');
    const [value, setValue] = useState('');
    const [showResult, setShowResult] = useState(false);
    const [result, setResult] = useState([]);
    let address;
    // Hook personnalisé pour obtenir le solde Ethereum de l'utilisateur
    const { data } = useBalance({
        address: account?.address,
    })
    console.log(data)
    // Hook personnalisé pour obtenir le nom ENS associé à l'adresse Ethereum de l'utilisateur
    const { data: ensName } = useEnsName({
        address: account?.address,
        chainId: 1,
    })
    // Fonction pour gérer la soumission du formulaire pour obtenir les soldes des jetons
    const handleSubmit = async () => {
        address = document.querySelector("#walletAddress").value;
        const chain = EvmChain.ETHEREUM;
        // Initialiser Moralis avec la clé API fournie
        await Moralis.start({
            apiKey: process.env.NEXT_PUBLIC_MORALIS_API_KEY,
        });
        // Utiliser l'API Moralis pour obtenir les soldes des jetons pour l'adresse de portefeuille spécifiée
        const response = await Moralis.EvmApi.token.getWalletTokenBalances({
            address,
            chain,
        });

        console.log(response.toJSON());
        setResult(response.toJSON());
        setShowResult(true);
        document.querySelector("#walletAddress").value = "";
    };
    // Hook personnalisé pour envoyer des transactions Ethereum
    const { sendTransaction } = useSendTransaction({
        request: {
            to,
            value: (value * 1e18).toString(),
        },
        onSuccess: () => alert('Transaction created successfully'),
        onError: () => alert('Insufficient balance')
    })
    // Hook personnalisé pour déconnecter l'utilisateur
    const disconnect = useDisconnect()

    return (
        <div >
            <div>
                {/* Rendre les informations si le composant est monté et que l'utilisateur est connecté */}
                {isMounted && account?.connector?.name && (
                    <>
                        <h3>Welcome to your accont {account.connector.name}</h3>
                        <h3>Your Token  is : {ensName ?? account?.address}
                            {ensName ? ` (${account?.address})` : null}</h3>
                        <h5>Your accont balace is : {data?.formatted} ETH</h5>
                        <br />
                        {/* Formulaire pour obtenir les soldes des jetons */}
                        <h1>Get Any Wallet's Token Balance</h1>
                        <form
                            name="create-profile-form"
                            method="POST"
                            action="#"
                        >
                            <label >
                                Add ERC20 Wallet Address :
                            </label>
                            <input
                                type="text"
                                id="walletAddress"
                                name="walletAddress"
                                maxLength="120"
                                required
                            />
                        </form>
                        <br />
                        <button onClick={handleSubmit}>
                            Submit
                        </button>
                        {/* Afficher les soldes des jetons */}
                        <section>
                            {showResult &&
                                result.map((token) => {
                                    return (
                                        <section
                                            key={result.indexOf(token)}
                                        >
                                            <img src={token.thumbnail} />
                                            <p>{token.name}</p>
                                            <p>
                                                {(token.balance / 10 ** token.decimals).toFixed(2)}
                                            </p>
                                        </section>
                                    );
                                })}
                        </section>
                        <br />
                        {/* Formulaire pour envoyer des transactions */}
                        <h1>Send Transaction</h1>
                        <form
                            name="create-profile-form"
                            method="POST"
                            action="#"
                        >
                            <label >
                                To : {" "}&nbsp;
                            </label>
                            <input
                                type="text"
                                value={to}
                                onChange={(e) => setTo(e.target.value)}
                            />
                            &nbsp;
                            <label >
                                Balance : {""}&nbsp;
                            </label>
                            <input
                                type="text"
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                            />
                        </form>
                        <br />
                        <button onClick={sendTransaction}>
                            send
                        </button>

                    </>
                )}
                <br />
                <br />
                {/* Rendre le bouton de déconnexion si l'utilisateur est connecté */}
                {account?.address && (
                    <button type='button' onClick={() => disconnect.disconnect()}>
                        Disconnect
                    </button>
                )}

            </div>
        </div>
    )
}