import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useEffect, useRef } from 'react';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredPermission?: string;
    ownerOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
    children, 
    requiredPermission,
    ownerOnly = false 
}) => {
    const { user, loading } = useAuth();
    const toastShown = useRef(false);

    // Compute authorization status BEFORE any returns so hooks are always called
    const isOwner = user?.role === "OWNER";
    const deniedReason = (() => {
        if (loading || !user || isOwner) return null;
        if (ownerOnly) return "owner";
        if (requiredPermission && !user.permissions?.includes(requiredPermission)) {
            return "permission";
        }
        return null;
    })();

    // Fire toast once when access is denied
    useEffect(() => {
        if (deniedReason && !toastShown.current) {
            toastShown.current = true;
            if (deniedReason === "owner") {
                toast.error("Access denied", {
                    description: "This page is restricted to the Academy Owner.",
                });
            } else {
                toast.error("Access denied", {
                    description: "You don't have permission to access this module.",
                });
            }
        }
    }, [deniedReason]);

    // Show loading spinner while checking authentication
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950">
                <div className="text-center space-y-4">
                    <Loader2 className="w-12 h-12 animate-spin text-yellow-500 mx-auto" />
                    <p className="text-slate-400 text-sm">Verifying authentication...</p>
                </div>
            </div>
        );
    }

    // If not authenticated, redirect to login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // OWNER bypasses all permission checks
    if (isOwner) {
        return <>{children}</>;
    }

    // Access denied — redirect to dashboard
    if (deniedReason) {
        return <Navigate to="/" replace />;
    }

    // If authenticated and authorized, render the protected content
    return <>{children}</>;
};

export default ProtectedRoute;
