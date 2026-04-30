import nodemailer from "nodemailer";

export async function sendEmail({ to, subject, html }) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log("Email settings missing. Skipping email.");
    return;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Property Dealer CRM" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
}

export function newLeadEmailTemplate(lead) {
  return `
    <div style="font-family: Arial, sans-serif;">
      <h2>New Lead Created</h2>
      <p><strong>Name:</strong> ${lead.name}</p>
      <p><strong>Phone:</strong> ${lead.phone}</p>
      <p><strong>Interest:</strong> ${lead.propertyInterest}</p>
      <p><strong>Budget:</strong> PKR ${lead.budget}</p>
      <p><strong>Priority:</strong> ${lead.score}</p>
    </div>
  `;
}

export function assignmentEmailTemplate(lead, agent) {
  return `
    <div style="font-family: Arial, sans-serif;">
      <h2>Lead Assigned</h2>
      <p>A new lead has been assigned to you.</p>
      <p><strong>Lead:</strong> ${lead.name}</p>
      <p><strong>Phone:</strong> ${lead.phone}</p>
      <p><strong>Interest:</strong> ${lead.propertyInterest}</p>
      <p><strong>Priority:</strong> ${lead.score}</p>
      <p><strong>Agent:</strong> ${agent.name}</p>
    </div>
  `;
}