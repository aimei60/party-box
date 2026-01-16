import '../css/privacypage.css'

function Privacy() {
    return (
        <div className='privacy-container'>
            <h1 className='privacy-title'>Privacy Policy</h1>
            <div className='privacy-section'>
                <div className='privacy-policy-wording'>
                    <h2 className='privacy-subtitle'>Purpose</h2>
                    <p className='privacy-wording'>
                        This Admin Privacy Policy explains how personal data of administrators is
                        collected, used, and protected within the administrative system of this
                        website. This policy applies only to administrators and not to public
                        users or customers.
                    </p>

                    <h2 className='privacy-subtitle'>Data We Collect</h2>
                    <p className='privacy-wording'>The following personal data is collected for administrative authentication and system management:</p>
                    <ul>
                        <li>Email address (used as a login identifier)</li>
                        <li>Password (stored only in hashed form, never in plain text)</li>
                        <li>Administrative role (Admin or Super Admin)</li>
                        <li>Admin and product data creation timestamps</li>
                    </ul>
                    <p className='privacy-wording'>No customer or public user data is collected through this system.</p>
                    
                    <h2 className='privacy-subtitle'>How the Data Is Used</h2>
                    <ul>
                        <li>Authentication and secure access to the admin panel</li>
                        <li>Role-based access control (Admin / Super Admin)</li>
                        <li>Managing products, product images, and administrative accounts</li>
                        <li>Security monitoring and audit purposes</li>
                    </ul>
                    <p className='privacy-wording'>Data is not used for marketing, tracking, or analytics.</p>
                    
                    <h2 className='privacy-subtitle'>Data Storage and Security</h2>
                    <ul>
                        <li>Passwords are securely hashed before being stored</li>
                        <li>Access to the database is restricted to the developer (Super Admin)</li>
                        <li>Administrative actions are limited by role permissions</li>
                        <li>Reasonable technical measures are used to protect stored data</li>
                    </ul>
                    
                    <h2 className='privacy-subtitle'>Data Access</h2>
                    <ul>
                        <li>The Super Admin (developer) has full access to the database</li>
                        <li>Admin users can create, read, update, and delete:</li>
                    </ul>
                    <ul>
                        <li>Products and product images</li>
                        <li>Other admin accounts (excluding Super Admin privileges)</li>
                    </ul>
                    <p className='privacy-wording'>No third parties have access to admin data.</p>
                    
                    <h2 className='privacy-subtitle'>Data Retention</h2>
                    <p className='privacy-wording'>
                        Administrative personal data is retained only for as long as the admin
                        account exists. When an admin account is deleted, its associated personal
                        data is removed from the system.
                    </p>
                    
                    <h2 className='privacy-subtitle'>Data Sharing</h2>
                    <p className='privacy-wording'>Admin personal data is not shared with third parties under any circumstances.</p>
                    
                    <h2 className='privacy-subtitle'>Your Rights</h2>
                    <p className='privacy-wording'>Administrators may request:</p>
                    <ul>
                        <li className='privacy-wording'> Access to their stored personal data</li>
                        <li className='privacy-wording'>Correction of inaccurate data</li>
                        <li className='privacy-wording'>Deletion of their admin account</li>
                    </ul>
                    <p className='privacy-wording'>Requests should be made directly to the Super Admin.</p>
                    
                    <h2 className='privacy-subtitle'>Contact</h2>
                    <p className='privacy-wording'>
                        For any questions or concerns regarding this policy or the handling of
                        admin data, please contact the Super Admin or the site owner. Contact
                        details have been provided to all administrators.
                    </p>
                    
                    <h2 className='privacy-subtitle'>Policy Updates</h2>
                    <p className='privacy-wording'>
                        This policy may be updated if system functionality or data handling
                        practices change. Admins will be notified of significant updates.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Privacy