const teacherWelcomeTemplate = ({ teacherName, loginUrl }) => `
<!DOCTYPE html>
<html lang="pt-BR">
<body style="margin:0;padding:0;background-color:#f4f5f7;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f5f7;padding:24px 0;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
        <tr><td style="background-color:#059669;padding:24px 32px;">
          <h1 style="margin:0;color:#ffffff;font-size:20px;">Bem-vindo(a) ao SchoolManager</h1>
        </td></tr>
        <tr><td style="padding:32px;">
          <p style="margin:0 0 16px;color:#111827;font-size:16px;">Olá, <strong>${teacherName || 'Professor(a)'}</strong>,</p>
          <p style="margin:0 0 16px;color:#374151;font-size:15px;line-height:1.6;">
            Sua conta de professor foi <strong>criada com sucesso</strong>. Você já pode acessar o sistema
            com o email cadastrado e a senha definida no momento do cadastro.
          </p>
          <table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 24px;"><tr><td style="border-radius:6px;background-color:#059669;">
            <a href="${loginUrl}" style="display:inline-block;padding:14px 28px;color:#ffffff;font-size:15px;font-weight:bold;text-decoration:none;">Acessar o sistema</a>
          </td></tr></table>
          <p style="margin:0;color:#9ca3af;font-size:13px;">Se o botão não funcionar, acesse: <br><a href="${loginUrl}" style="color:#059669;">${loginUrl}</a></p>
        </td></tr>
        <tr><td style="background-color:#f9fafb;padding:20px 32px;border-top:1px solid #e5e7eb;">
          <p style="margin:0;color:#9ca3af;font-size:12px;">Mensagem automática do SchoolManager. Por favor, não responda este email.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

module.exports = { teacherWelcomeTemplate };
