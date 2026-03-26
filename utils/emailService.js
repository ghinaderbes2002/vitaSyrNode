import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: Number(process.env.EMAIL_PORT) === 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// إشعار للإدارة عند وصول طلب توظيف جديد مع CV
export const sendJobApplicationNotification = async ({ fullName, email, phone, specialization, yearsOfExperience, education, coverLetter, linkedinUrl, cvFilePath, ref1Name, ref1Company, ref1JobTitle, ref1Phone, ref2Name, ref2Company, ref2JobTitle, ref2Phone }) => {
  try {
    const attachments = [];
    if (cvFilePath) {
      attachments.push({
        filename: `CV-${fullName.replace(/\s+/g, "_")}.pdf`,
        path: cvFilePath,
      });
    }

    await transporter.sendMail({
      from: `"VitaSyr Website" <${process.env.EMAIL_USER}>`,
      to: process.env.CONTACT_RECEIVER_EMAIL,
      replyTo: `"${fullName}" <${email}>`,
      subject: `طلب توظيف جديد: ${fullName} - ${specialization}`,
      attachments,
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9;">
          <div style="background: white; padding: 30px; border-radius: 10px; border-top: 4px solid #16a34a;">
            <h2 style="color: #14532d; margin-top: 0;">طلب توظيف جديد - VitaSyr</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; color: #555; width: 160px;"><strong>الاسم:</strong></td><td style="padding: 8px 0;">${fullName}</td></tr>
              <tr><td style="padding: 8px 0; color: #555;"><strong>البريد:</strong></td><td style="padding: 8px 0;"><a href="mailto:${email}">${email}</a></td></tr>
              <tr><td style="padding: 8px 0; color: #555;"><strong>الهاتف:</strong></td><td style="padding: 8px 0;">${phone}</td></tr>
              <tr><td style="padding: 8px 0; color: #555;"><strong>التخصص:</strong></td><td style="padding: 8px 0;">${specialization}</td></tr>
              <tr><td style="padding: 8px 0; color: #555;"><strong>سنوات الخبرة:</strong></td><td style="padding: 8px 0;">${yearsOfExperience} سنوات</td></tr>
              <tr><td style="padding: 8px 0; color: #555;"><strong>التعليم:</strong></td><td style="padding: 8px 0;">${education}</td></tr>
              ${linkedinUrl ? `<tr><td style="padding: 8px 0; color: #555;"><strong>LinkedIn:</strong></td><td style="padding: 8px 0;"><a href="${linkedinUrl}">${linkedinUrl}</a></td></tr>` : ""}
            </table>
            <h3 style="color: #14532d; margin-top: 20px; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">المراجع</h3>
            <h4 style="color: #374151; margin-top: 15px;">المرجع الأول</h4>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 6px 0; color: #555; width: 160px;"><strong>الاسم:</strong></td><td>${ref1Name}</td></tr>
              <tr><td style="padding: 6px 0; color: #555;"><strong>الشركة:</strong></td><td>${ref1Company}</td></tr>
              <tr><td style="padding: 6px 0; color: #555;"><strong>المسمى الوظيفي:</strong></td><td>${ref1JobTitle}</td></tr>
              <tr><td style="padding: 6px 0; color: #555;"><strong>رقم التواصل:</strong></td><td>${ref1Phone}</td></tr>
            </table>
            <h4 style="color: #374151; margin-top: 15px;">المرجع الثاني</h4>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 6px 0; color: #555; width: 160px;"><strong>الاسم:</strong></td><td>${ref2Name}</td></tr>
              <tr><td style="padding: 6px 0; color: #555;"><strong>الشركة:</strong></td><td>${ref2Company}</td></tr>
              <tr><td style="padding: 6px 0; color: #555;"><strong>المسمى الوظيفي:</strong></td><td>${ref2JobTitle}</td></tr>
              <tr><td style="padding: 6px 0; color: #555;"><strong>رقم التواصل:</strong></td><td>${ref2Phone}</td></tr>
            </table>
            ${coverLetter ? `
            <div style="margin-top: 20px; background: #f0fdf4; padding: 15px; border-radius: 8px; border-right: 4px solid #16a34a;">
              <strong style="color: #14532d;">رسالة التغطية:</strong>
              <p style="margin: 10px 0 0; line-height: 1.7; color: #333;">${coverLetter}</p>
            </div>` : ""}
            ${cvFilePath ? `<p style="margin-top: 20px; color: #555;">📎 <strong>السيرة الذاتية مرفقة بهذا الإيميل</strong></p>` : ""}
          </div>
        </div>
      `,
    });
    console.log("Job application notification sent");
  } catch (error) {
    console.error("Failed to send job application notification:", error.message);
  }
};

// إشعار للإدارة عند وصول رسالة تواصل جديدة
export const sendContactNotification = async ({ fullName, email, phone, subject, message }) => {
  try {
    await transporter.sendMail({
      from: `"VitaSyr Website" <${process.env.EMAIL_USER}>`,
      to: process.env.CONTACT_RECEIVER_EMAIL,
      replyTo: `"${fullName}" <${email}>`,
      subject: `رسالة جديدة: ${subject}`,
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9;">
          <div style="background: white; padding: 30px; border-radius: 10px; border-top: 4px solid #2563eb;">
            <h2 style="color: #1e3a5f; margin-top: 0;">رسالة جديدة من موقع VitaSyr</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; color: #555; width: 130px;"><strong>الاسم:</strong></td><td style="padding: 8px 0;">${fullName}</td></tr>
              <tr><td style="padding: 8px 0; color: #555;"><strong>البريد:</strong></td><td style="padding: 8px 0;"><a href="mailto:${email}">${email}</a></td></tr>
              <tr><td style="padding: 8px 0; color: #555;"><strong>الهاتف:</strong></td><td style="padding: 8px 0;">${phone}</td></tr>
              <tr><td style="padding: 8px 0; color: #555;"><strong>الموضوع:</strong></td><td style="padding: 8px 0;">${subject}</td></tr>
            </table>
            <div style="margin-top: 20px; background: #f0f4ff; padding: 15px; border-radius: 8px; border-right: 4px solid #2563eb;">
              <strong style="color: #1e3a5f;">الرسالة:</strong>
              <p style="margin: 10px 0 0; line-height: 1.7; color: #333;">${message}</p>
            </div>
          </div>
        </div>
      `,
    });
    console.log("Contact notification sent");
  } catch (error) {
    console.error("Failed to send contact notification:", error.message);
  }
};
