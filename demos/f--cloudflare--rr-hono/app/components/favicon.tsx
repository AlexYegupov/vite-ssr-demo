export function Favicon() {
  // Generate SVG as data URI for favicon
  const svgContent = `
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="16" fill="#f76b15"/>
      <text x="16" y="20" font-family="Inter, sans-serif" font-weight="bold" font-size="14" fill="white" text-anchor="middle">DEMO</text>
    </svg>
  `.trim();
  
  const dataUri = `data:image/svg+xml,${encodeURIComponent(svgContent)}`;
  
  return <link rel="icon" type="image/svg+xml" href={dataUri} />;
}
