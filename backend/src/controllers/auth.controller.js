import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";
import pool from "../config/db.js";

export const registerTenant = async (req, res) => {
  const { tenantName, subdomain, adminEmail, adminPassword, adminFullName } =
    req.body;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const tenantId = uuid();
    await client.query(
      `INSERT INTO tenants (id, name, subdomain) VALUES ($1,$2,$3)`,
      [tenantId, tenantName, subdomain]
    );

    const passwordHash = await bcrypt.hash(adminPassword, 10);
    const adminId = uuid();
    await client.query(
      `INSERT INTO users (id, tenant_id, email, password_hash, full_name, role)
       VALUES ($1,$2,$3,$4,$5,'tenant_admin')`,
      [adminId, tenantId, adminEmail, passwordHash, adminFullName]
    );

    await client.query("COMMIT");

    res.status(201).json({
      success: true,
      message: "Tenant registered successfully",
      data: {
        tenantId,
        subdomain,
        adminUser: {
          id: adminId,
          email: adminEmail,
          fullName: adminFullName,
          role: "tenant_admin",
        },
      },
    });
  } catch (e) {
    await client.query("ROLLBACK");
    res
      .status(409)
      .json({ success: false, message: "Tenant or email already exists" });
  } finally {
    client.release();
  }
};

export const login = async (req, res) => {
  const { email, password, subdomain } = req.body;

  console.log("LOGIN BODY:", req.body);

  const tenant = await pool.query(
    `SELECT * FROM tenants WHERE subdomain=$1 AND status='active'`,
    [subdomain]
  );

  if (!tenant.rows.length) {
    return res
      .status(404)
      .json({ success: false, message: "Tenant not found" });
  }

  const user = await pool.query(
    `SELECT * FROM users WHERE email=$1 AND tenant_id=$2 AND is_active=true`,
    [email, tenant.rows[0].id]
  );

  if (!user.rows.length) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid credentials" });
  }

  const valid = await bcrypt.compare(password, user.rows[0].password_hash);
  if (!valid) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid credentials" });
  }

  const token = jwt.sign(
    {
      userId: user.rows[0].id,
      tenantId: user.rows[0].tenant_id,
      role: user.rows[0].role,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  console.log("✅ Login successful, sending token");

  res.json({
    success: true,
    data: {
      user: {
        id: user.rows[0].id,
        email: user.rows[0].email,
        fullName: user.rows[0].full_name,
        role: user.rows[0].role,
        tenantId: user.rows[0].tenant_id,
      },
      token,
    },
  });
};

// ⭐⭐⭐ UNCOMMENT THESE TWO FUNCTIONS ⭐⭐⭐
export const me = async (req, res) => {
  const user = await pool.query(
    `SELECT id,email,full_name,role,is_active FROM users WHERE id=$1`,
    [req.user.userId]
  );
  res.json({ success: true, data: user.rows[0] });
};

export const logout = async (_req, res) => {
  res.json({ success: true, message: "Logged out successfully" });
};
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import { v4 as uuid } from "uuid";
// import pool from "../config/db.js";

// export const registerTenant = async (req, res) => {
//   const { tenantName, subdomain, adminEmail, adminPassword, adminFullName } =
//     req.body;

//   const client = await pool.connect();
//   try {
//     await client.query("BEGIN");

//     const tenantId = uuid();
//     await client.query(
//       `INSERT INTO tenants (id, name, subdomain) VALUES ($1,$2,$3)`,
//       [tenantId, tenantName, subdomain]
//     );

//     const passwordHash = await bcrypt.hash(adminPassword, 10);
//     const adminId = uuid();
//     await client.query(
//       `INSERT INTO users (id, tenant_id, email, password_hash, full_name, role)
//        VALUES ($1,$2,$3,$4,$5,'tenant_admin')`,
//       [adminId, tenantId, adminEmail, passwordHash, adminFullName]
//     );

//     await client.query("COMMIT");

//     res.status(201).json({
//       success: true,
//       message: "Tenant registered successfully",
//       data: {
//         tenantId,
//         subdomain,
//         adminUser: {
//           id: adminId,
//           email: adminEmail,
//           fullName: adminFullName,
//           role: "tenant_admin",
//         },
//       },
//     });
//   } catch (e) {
//     await client.query("ROLLBACK");
//     res
//       .status(409)
//       .json({ success: false, message: "Tenant or email already exists" });
//   } finally {
//     client.release();
//   }
// };

// export const login = async (req, res) => {
//   const { email, password, subdomain } = req.body;

//   // 🔍 DEBUG LOG 1: what frontend sends
//   console.log("LOGIN BODY:", req.body);

//   // 🔍 DEBUG LOG 2: what tenants exist in DB
//   const allTenants = await pool.query(
//     "SELECT id, subdomain, status FROM tenants"
//   );
//   console.log("ALL TENANTS IN DB:", allTenants.rows);

//   // 🔍 ACTUAL LOGIN LOGIC
//   const tenant = await pool.query(
//     `SELECT * FROM tenants WHERE subdomain=$1 AND status='active'`,
//     [subdomain]
//   );

//   if (!tenant.rows.length) {
//     return res
//       .status(404)
//       .json({ success: false, message: "Tenant not found" });
//   }

//   const user = await pool.query(
//     `SELECT * FROM users WHERE email=$1 AND tenant_id=$2 AND is_active=true`,
//     [email, tenant.rows[0].id]
//   );

//   if (!user.rows.length) {
//     return res
//       .status(401)
//       .json({ success: false, message: "Invalid credentials" });
//   }

//   const valid = await bcrypt.compare(password, user.rows[0].password_hash);
//   if (!valid) {
//     return res
//       .status(401)
//       .json({ success: false, message: "Invalid credentials" });
//   }

//   const token = jwt.sign(
//     {
//       userId: user.rows[0].id,
//       tenantId: user.rows[0].tenant_id,
//       role: user.rows[0].role,
//     },
//     process.env.JWT_SECRET,
//     { expiresIn: process.env.JWT_EXPIRES_IN }
//   );

//   res.json({
//     success: true,
//     data: {
//       user: {
//         id: user.rows[0].id,
//         email: user.rows[0].email,
//         fullName: user.rows[0].full_name,
//         role: user.rows[0].role,
//         tenantId: user.rows[0].tenant_id,
//       },
//       token,
//     },
//   });
// };

// export const login = async (req, res) => {
//   const { email, password, subdomain } = req.body;

//   const tenant = await pool.query(
//     `SELECT * FROM tenants WHERE subdomain=$1 AND status='active'`,
//     [subdomain]
//   );
//   if (!tenant.rows.length) {
//     return res.status(404).json({ success: false, message: 'Tenant not found' });
//   }

//   const user = await pool.query(
//     `SELECT * FROM users WHERE email=$1 AND tenant_id=$2 AND is_active=true`,
//     [email, tenant.rows[0].id]
//   );
//   if (!user.rows.length) {
//     return res.status(401).json({ success: false, message: 'Invalid credentials' });
//   }

//   const valid = await bcrypt.compare(password, user.rows[0].password_hash);
//   if (!valid) {
//     return res.status(401).json({ success: false, message: 'Invalid credentials' });
//   }

//   const token = jwt.sign(
//     {
//       userId: user.rows[0].id,
//       tenantId: user.rows[0].tenant_id,
//       role: user.rows[0].role
//     },
//     process.env.JWT_SECRET,
//     { expiresIn: process.env.JWT_EXPIRES_IN }
//   );

//   res.json({
//     success: true,
//     data: {
//       user: {
//         id: user.rows[0].id,
//         email: user.rows[0].email,
//         fullName: user.rows[0].full_name,
//         role: user.rows[0].role,
//         tenantId: user.rows[0].tenant_id
//       },
//       token,
//       expiresIn: 86400
//     }
//   });
// };

// export const me = async (req, res) => {
//   const user = await pool.query(
//     `SELECT id,email,full_name,role,is_active FROM users WHERE id=$1`,
//     [req.user.userId]
//   );
//   res.json({ success: true, data: user.rows[0] });
// };

// export const logout = async (_req, res) => {
//   res.json({ success: true, message: 'Logged out successfully' });
// };

// export const login = async (req, res) => {
//   const { email, password, subdomain } = req.body;

//   const tenant = await pool.query(
//     `SELECT * FROM tenants WHERE subdomain=$1 AND status='active'`,
//     [subdomain]
//   );

//   if (!tenant.rows.length) {
//     return res
//       .status(404)
//       .json({ success: false, message: "Tenant not found" });
//   }

//   const user = await pool.query(
//     `SELECT * FROM users WHERE email=$1 AND tenant_id=$2 AND is_active=true`,
//     [email, tenant.rows[0].id]
//   );

//   if (!user.rows.length) {
//     return res
//       .status(401)
//       .json({ success: false, message: "Invalid credentials" });
//   }

//   const valid = await bcrypt.compare(password, user.rows[0].password_hash);
//   if (!valid) {
//     return res
//       .status(401)
//       .json({ success: false, message: "Invalid credentials" });
//   }

//   const token = jwt.sign(
//     {
//       userId: user.rows[0].id,
//       tenantId: user.rows[0].tenant_id,
//       role: user.rows[0].role,
//     },
//     process.env.JWT_SECRET,
//     { expiresIn: process.env.JWT_EXPIRES_IN }
//   );

//   res.json({
//     success: true,
//     data: {
//       user: {
//         id: user.rows[0].id,
//         email: user.rows[0].email,
//         fullName: user.rows[0].full_name,
//         role: user.rows[0].role,
//         tenantId: user.rows[0].tenant_id,
//       },
//       token,
//       expiresIn: 86400,
//     },
//   });
// };
