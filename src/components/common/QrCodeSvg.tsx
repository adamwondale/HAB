import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';

interface QrCodeSvgProps {
  value: string;
  size?: number;
  className?: string;
  darkColor?: string;
  lightColor?: string;
}

export const QrCodeSvg: React.FC<QrCodeSvgProps> = ({
  value,
  size = 128,
  className = '',
  darkColor = '#000000',
  lightColor = '#ffffff'
}) => {
  const [dataUrl, setDataUrl] = useState<string>('');
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    QRCode.toDataURL(value, {
      width: size,
      margin: 1,
      color: {
        dark: darkColor,
        light: lightColor
      },
      errorCorrectionLevel: 'M'
    })
      .then((url) => {
        if (isMounted) {
          setDataUrl(url);
          setError(false);
        }
      })
      .catch((err) => {
        console.error('Failed to generate QR code', err);
        if (isMounted) setError(true);
      });

    return () => {
      isMounted = false;
    };
  }, [value, size, darkColor, lightColor]);

  if (error || !dataUrl) {
    return (
      <div
        style={{ width: size, height: size }}
        className={`bg-slate-100 dark:bg-slate-800 rounded flex items-center justify-center text-[10px] text-slate-400 font-mono ${className}`}
      >
        {error ? 'QR Error' : 'Generating...'}
      </div>
    );
  }

  return (
    <img
      src={dataUrl}
      alt="Employee Verification QR Code"
      width={size}
      height={size}
      className={`rounded shadow-xs ${className}`}
      style={{ imageRendering: 'pixelated' }}
    />
  );
};
