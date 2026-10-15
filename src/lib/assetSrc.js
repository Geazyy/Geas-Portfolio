export const assetSrc = (asset) => (
  typeof asset === 'string' ? asset : asset?.src
);
