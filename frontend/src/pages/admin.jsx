import { useEffect, useState} from 'react'
import { useLocation, useNavigate, useOutletContext} from "react-router-dom";
import '../css/admin.css'

function Admin() {
    //for CSRF
    const navigate = useNavigate();
    const { csrfToken } = useOutletContext(); 

    useEffect(() => {
        if (!csrfToken) {
        navigate("/dashboard");
        }
    }, [csrfToken, navigate]);

    if (!csrfToken) return null;
    //who am i check for react and better UI
    const [currentAdmin, setCurrentAdmin] = useState(null);

    async function fetchCurrentAdmin() {
        try {
        const response = await fetch("/api/admin/auth/me", {
            method: "GET",
            credentials: "include"
        });

        const data = await response.json();

        if (response.ok === false) {
            return;
        }

        setCurrentAdmin(data.admin);
        } catch (err) {
        }
    }

    //list admins
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    async function listAdmins() {
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const response = await fetch("/api/admin/admins", {
                method: "GET",
                credentials: "include",
            })

            const data = await response.json();

            if (response.ok === false) {
                setError(data.error || "Failed to load admins")
                setLoading(false)
                return
            }
            setAdmins(data);
            setLoading(false);
        }   catch (err) {
            setError("Error loading Admins list");
            setLoading(false)
        } 
    } 
    
    useEffect(function () {
        if (!csrfToken) {
            return;
        }
        fetchCurrentAdmin();
        listAdmins();
    }, [csrfToken])

    //create admins
    const [form, setForm] = useState({ email: "", password: "", role: "admin"})

    async function createAdmin(e) {
        e.preventDefault()
        setLoading(true);
        setError("")
        setSuccess("")

       try {
        const response = await fetch("/api/admin/admins", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-Token": csrfToken,
            },
            body: JSON.stringify({email: form.email, password: form.password, role: form.role})
        })

        const data = await response.json();

        if (response.ok === false) {
            setError(data.error || "Failed to create admin");
            setLoading(false);
            return;
        }

        setSuccess("Successfully created Admin!")
        setLoading(false)
        setForm({email: "", password: "", role: "admin"});
        listAdmins()
        } catch (err) {
        setError("Unable to create admin!")
        setLoading(false);
        }
    }

    // to enter user details
    function handleChange(event) {
        const field = event.target.name;
        const value = event.target.value;

        if (field === "email") {
            setForm({
            ...form,
            email: value
            });
        }

        if (field === "password") {
            setForm({
            ...form,
            password: value
            });
        }

        if (field === "role") {
            setForm({
            ...form,
            role: value
            });
        }
    }

    //update admin
    const [editId, setEditId] = useState(null);
    const [editForm, setEditForm] = useState({email: "", password: "", role: "admin" });

    //to edit the fields
    function Edit(admin) {
        setEditId(admin.id)
        setEditForm({email: admin.email, password: "", role: admin.role})
        setError("")
        setSuccess("")
    }

    //cancel editing
    function cancelEdit() {
        setEditId(null);
        setEditForm({email: "", password: "", role: "admin"});
    }

    //enter user details
    function handleEditChange(e) {
        const field = e.target.name;
        const value = e.target.value;

        if (field === "email") {
            setEditForm({ ...editForm, email: value });
        }

        if (field === "password") {
            setEditForm({ ...editForm, password: value });
        }

        if (field === "role") {
            setEditForm({ ...editForm, role: value });
        }
    }

    async function updateAdmin(e) {
        e.preventDefault()
        
        if (editId === null) {
            setError("No admin selected to update");
            return
        }
        setLoading(true)
        setError("")
        setSuccess("")

        try {
            const response = await fetch("/api/admin/admins/" + editId, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-Token": csrfToken,
                },
                body: JSON.stringify({email: editForm.email, password: editForm.password, role: editForm.role})
            })

            const data = await response.json();

            if (response.ok === false) {
                setError(data.error || "Failed to update admin");
                setLoading(false);
                return;
            }
            setSuccess("Successfully updated Admin!")
            setLoading(false)
            cancelEdit()
            listAdmins()
            } catch (err) {
            setError("Unable to update admin!")
            setLoading(false);
            }
        }
    
        //delete admin
        async function deleteAdmin(admin) {
            const confirmed = window.confirm("Delete " + admin.email + " ?");
            if (confirmed === false) {
                return;
            }
            setLoading(true);
            setError("");
            setSuccess("");

            try {
            const response = await fetch("/api/admin/admins/" + admin.id, {
                method: "DELETE",
                credentials: "include",
                headers: {
                    "X-CSRF-Token": csrfToken,
                }
            });

            const data = await response.json();

            if (response.ok === false) {
                setError(data.error || "Failed to delete admin");
                setLoading(false);
                return;
            }
            setSuccess("Successfully deleted admin!");
            setLoading(false);

            if (editId === admin.id) {
                cancelEdit();
            }
            listAdmins();
            } catch (err) {
            setError("Unable to delete admin!");
            setLoading(false);
            }
        }

        //role UI admin /superadmin permissions 
        function isSuperadmin() {
            if (!currentAdmin) {
                return false;
            }

            if (currentAdmin.role === "superadmin") {
                return true;
            }
            return false;
        }

        useEffect (
            function () {
            if (currentAdmin && currentAdmin.role !== "superadmin") {
                if (form.role !== "admin") {
                    setForm({email: form.email, password: form.password, role: "admin"});
                }

                if (editForm.role !== "admin") {
                    setEditForm({email: editForm.email, password: editForm.password, role: "admin"});
                    }
                }
            },
            [currentAdmin]
        );

    return (
        <div className="admin-section">
        <h1 className="admin-title">Admin Management</h1>
        <div className="admin-management-container">
            {/* CREATE admins UI*/}
            <div className="admin-card">
            <h2 className="admin-subtitle">Create Admin</h2>
            <form onSubmit={createAdmin} className="admin-form">
                {/* form to create admin UI*/}
                <label className="admin-label">Email<input className="admin-input" type="email" name="email" value={form.email} onChange={handleChange} required/></label>
                <label className="admin-label">Password<input className="admin-input" type="password" name="password" value={form.password} onChange={handleChange} required /></label>
                {/* depending on admin/ superadmin the below options are presented*/}
                {currentAdmin === null && (<p>Loading your admin role...</p>)}
                {currentAdmin && currentAdmin.role === "admin" && (<p>New users will be created as <strong>admin</strong>.</p>)}
                {currentAdmin && currentAdmin.role === "superadmin" && (
                    <label className="admin-label">Role<select className="admin-input" name="role" value={form.role} onChange={handleChange}>
                        <option value="admin">admin</option>
                        <option value="superadmin">superadmin</option>
                        </select>
                    </label>)}
                {/* creating, loading and success status and error statuses*/}
                <button className="admin-button" type="submit" disabled={loading}>
                    {loading && "Creating..."}
                    {!loading && "Create Admin"}
                </button>
            </form>
            {success !== "" && <p className="success">{success}</p>}
            {error !== "" && <p className="error">{error}</p>}
            </div>

            {/*LIST admins */}
            {/* loading and error status or errors*/}
            {loading && <p>Loading…</p>}
            {error && <p className="error">{error}</p>}
            {/* table to enter data and actions for that data*/}
            {loading === false && error === "" && (
            <table className="admin-table">
                <thead>
                <tr>
                    <th className='table-title'>ID</th>
                    <th className='table-title'>Email</th>
                    <th className='table-title'>Role</th>
                    <th className='table-title'>Created</th>
                    <th className='table-title'>Actions</th>
                </tr>
                </thead>
                <tbody>
                {/* mapping user input*/}
                {admins.map(function(admin) {
                    return (
                    <tr className='user-detail' key={admin.id}>
                        <td className='user-detail'>{admin.id}</td>
                        <td className='user-detail'>{admin.email}</td>
                        <td className='user-detail'>{admin.role}</td>
                        <td className='user-detail'>{new Date(admin.created_at).toLocaleString()}</td>
                        <td className='admin-buttons'>
                            <button className="admin-button" id='edit' type="button" onClick={function () {Edit(admin);}}disabled={loading}>Edit</button>
                            {/*DELETE admin */}
                            <button className="admin-button" id='delete' type="button" onClick={function () {deleteAdmin(admin);}} disabled={loading}>Delete</button>
                        </td>
                    </tr>);})}
                </tbody>
            </table>
            )}
            <button className='refresh' onClick={listAdmins}>Refresh</button> 
            {/*EDIT admin*/}
            <div className="admin-card">
                <h2 className="admin-subtitle">Edit Admin</h2>
                {editId === null && <p>Select an admin and click Edit.</p>}
                {editId !== null && (
                    <form onSubmit={updateAdmin} className="admin-form">
                        {/* enter updated email or password*/}
                    <label className="admin-label">Email<input className="admin-input" type="email" name="email" value={editForm.email} onChange={handleEditChange} required/></label>
                    <label className="admin-label">New Password (optional)<input className="admin-input" type="password" name="password" value={editForm.password} onChange={handleEditChange}/></label>
                    {/*depening on role the below is open to the user*/}
                    {currentAdmin && currentAdmin.role === "admin" && (
                        <p>Role is locked to <strong>admin</strong>.</p>)}
                    {isSuperadmin() && (<label className="admin-label">Role<select className="admin-input" name="role" value={editForm.role} onChange={handleEditChange}>
                            <option value="admin">admin</option>
                            <option value="superadmin">superadmin</option>
                            </select>
                        </label>
                    )}
                    {/*submit and loading statuses */}
                    <button className="admin-button" type="submit" disabled={loading}>
                        {loading && "Saving..."}
                        {loading === false && "Save Changes"}
                    </button>
                    <button className="admin-button" type="button" onClick={cancelEdit} disabled={loading}>Cancel</button>
                    </form>
                )}
                </div>
            </div>
        </div>
  );

}

export default Admin;