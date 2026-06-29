import * as React from 'react';

interface VerificationEmailProps {
  username: string;
  verifyCode: string;
}

export default function VerificationEmail({ username, verifyCode }: VerificationEmailProps) {
  return (
    <div style={{
      fontFamily: 'HelveticaNeue, Helvetica, Arial, sans-serif',
      backgroundColor: '#09090b',
      color: '#ffffff',
      padding: '40px 20px',
      borderRadius: '12px',
      maxWidth: '465px',
      margin: '0 auto',
      border: '1px solid #27272a'
    }}>
      <h2 style={{ color: '#818cf8', fontSize: '24px', textAlign: 'center', margin: '0 0 20px' }}>
        Caarya Studio
      </h2>
      <p style={{ fontSize: '16px', lineHeight: '24px' }}>
        Hello <strong>{username}</strong>,
      </p>
      <p style={{ fontSize: '14px', lineHeight: '24px', color: '#a1a1aa' }}>
        Thank you for signing up. Please use the verification security code below to activate your account:
      </p>
      
      <div style={{
        backgroundColor: '#18181b',
        borderRadius: '8px',
        border: '1px solid #3f3f46',
        padding: '16px',
        textAlign: 'center',
        margin: '30px 0',
        fontSize: '32px',
        fontWeight: 'bold',
        letterSpacing: '4px',
        color: '#22c55e'
      }}>
        {verifyCode}
      </div>
      
      <p style={{ fontSize: '12px', color: '#71717a', textAlign: 'center', margin: '20px 0 0' }}>
        This authentication code is temporary and will automatically expire in 1 hour.
      </p>
    </div>
  );
}