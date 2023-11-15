import * as React from 'react'

// Ce hook personnalisé, useIsMounted, fournit une valeur booléenne indiquant si le composant est monté.
// Il utilise le hook useState pour gérer l'état de la montée, initialisé à false.
// Le hook useEffect est utilisé pour mettre à jour l'état du composant après le rendu initial.
export const useIsMounted = () => {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => setMounted(true), [])

  return mounted
}