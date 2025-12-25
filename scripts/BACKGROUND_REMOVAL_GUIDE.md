# Background Removal Guide for Clean Image Compositing

For the best, cleanest results, please use a professional background removal tool to create PNG files with transparent backgrounds. The script will automatically use these if they exist.

## Step 1: Extract Person from New Image

1. Go to [remove.bg](https://www.remove.bg) (free, no signup needed)
2. Upload `public/images/new_AssistantPastor.jpg`
3. Wait for processing (usually 5-10 seconds)
4. Download the result
5. Save it as `public/images/new_AssistantPastor.png`

## Step 2: Extract Background from Current Image (Optional but Recommended)

For the cleanest background extraction:

1. Go to [remove.bg](https://www.remove.bg)
2. Upload `public/images/AsstPastor_Olise.backup.webp` (or the original)
3. Download the result (this will have the person removed, background transparent)
4. In an image editor (Photoshop, GIMP, or online editor like Photopea):
   - Open the result from remove.bg
   - The person should be removed, leaving transparent areas
   - Fill the transparent areas with the original background (white + flowers)
   - Or simply use the original image and manually mask out the person
5. Save as `public/images/background_only.png` (optional - script will auto-extract if not provided)

## Step 3: Run the Script

Once you have `new_AssistantPastor.png`, simply run:

```bash
npm run composite-pastor
```

The script will automatically:
- Use the PNG with transparency for the new person
- Extract the background from the current image
- Composite them together cleanly

## Alternative: Use Photopea (Free Online Photoshop)

1. Go to [Photopea.com](https://www.photopea.com)
2. Upload your image
3. Use the "Magic Wand" or "Quick Selection" tool to select the background
4. Delete or mask it out
5. Export as PNG with transparency

## Tips for Best Results

- **For the new person image**: Make sure the entire person is visible and the background is completely removed
- **For the background**: Ensure the white background and flowers are preserved, with the old person completely removed
- **File format**: Always save as PNG to preserve transparency
- **File location**: Place files in `public/images/` folder

