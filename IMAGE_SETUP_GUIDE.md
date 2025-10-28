# Quick Setup: Hero Background Image

## Step 1: Save the Image
Save the provided architectural image (Jaisalmer Fort) as:
```
frontend/public/assets/hero-bg.jpg
```

## Step 2: That's it!
The image will automatically be used as the hero background on the landing page.

## File Location
```
Personal_Travel_Bucket_List_DevOps/
└── frontend/
    └── public/
        └── assets/
            └── hero-bg.jpg  ← Save your image here
```

## Alternative Image Sources
If you don't have the image yet, you can use:
- Any travel/architecture photo you like
- Free images from:
  - https://unsplash.com/s/photos/travel
  - https://unsplash.com/s/photos/architecture
  - https://pexels.com/search/travel/

## Image Recommendations
- **Format:** JPG or PNG
- **Size:** At least 1920x1080px for best quality
- **Aspect Ratio:** 16:9 or wider works best
- **File Size:** Under 500KB for faster loading (compress if needed)

## Testing
After saving the image:
1. Start the app: `docker compose up` or `cd frontend && npm run dev`
2. Visit http://localhost:5173
3. You should see the image as the hero background with a gradient overlay

## Troubleshooting
If the image doesn't show:
- Check the filename is exactly `hero-bg.jpg` (case-sensitive)
- Check it's in the correct folder: `frontend/public/assets/`
- Clear browser cache (Ctrl+F5)
- Check browser console for 404 errors
