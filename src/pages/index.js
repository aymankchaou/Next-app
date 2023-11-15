import { Connect } from "../components/Connect";
import { Account } from "../components/Account";

import { useIsMounted } from '../hooks'
export default function Home() {
    const isMounted = useIsMounted()
    if (!isMounted) return null
    return (
        <>
            <Connect />
            <Account />

        </>
    );
}