'use client'

import { signOut } from "next-auth/react";
import { Button } from '@/components/ui/button';

export function LogoutButton() {
    const handleLogout = async () => {
        await signOut({ callbackUrl: "/" }); // Redirects to /login after logout
    };

    return (
        <Button asChild onClick={handleLogout}>
            <span>Sair</span>
        </Button>
    );
}