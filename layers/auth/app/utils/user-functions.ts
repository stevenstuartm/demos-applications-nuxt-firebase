import type { DemoUser } from "~~/layers/auth/shared/types";

// Format last sign in date
export function formatLastSignIn( timestamp: string | undefined ): string {
    if ( !timestamp ) {
        return 'Never';
    }

    try {
        const date = new Date( timestamp );
        const now = new Date();
        const diffInHours = Math.floor( ( now.getTime() - date.getTime() ) / ( 1000 * 60 * 60 ) );

        if ( diffInHours < 1 ) {
            return 'Just now';
        }

        if ( diffInHours < 24 ) {
            return `${ diffInHours } hours ago`;
        }

        if ( diffInHours < 48 ) {
            return 'Yesterday';
        }

        if ( diffInHours < 168 ) {
            return `${ Math.floor( diffInHours / 24 ) } days ago`;
        }

        return date.toLocaleDateString();
    } catch {
        return 'Unknown';
    }
}

// Get role class for styling (since NuxtBadge doesn't accept custom colors)
export function getRoleClass( role: string ) {
    switch ( role ) {
        case 'admin':
            return 'bg-red-100 text-red-800'
        case 'support':
            return 'bg-blue-100 text-blue-800'
        case 'product-owner':
            return 'bg-purple-100 text-purple-800'
        case 'user':
            return 'bg-green-100 text-green-800'
        default:
            return 'bg-gray-100 text-gray-800'
    }
}

// Get user initials for avatar
export function getUserInitials( user: DemoUser ): string {
    if ( user.displayName ) {
        return user.displayName
                .split( ' ' )
                .map( ( name: string ) => name.charAt( 0 ) )
                .slice( 0, 2 )
                .join( '' )
                .toUpperCase();
    }

    return user.email.charAt( 0 ).toUpperCase();
}
