"use client";
import { Appbar } from "@/components/Appbar";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Home() {
    const { data: session } = useSession();

    return (
        <>
            <Appbar
                user={session?.user}
                onSignin={() => signIn()}
                onSignout={() => signOut()}
            />
        </>
    );
}