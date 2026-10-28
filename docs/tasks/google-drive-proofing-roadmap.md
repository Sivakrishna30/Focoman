# Google Drive Proofing & In-App Selection Roadmap (Method B)

This document specifies the architecture, security scope, and implementation plan for the **Google Drive In-App Photo Proofing & Selection Engine** in FocoMan.

---

## 1. Executive Summary & Architectural Decision

To provide professional wedding & event photography studios with native photo selection without incurring third-party annual cybersecurity audit fees ($1,500 – $3,000/year for restricted scopes), FocoMan adopts **Method B: Google Picker API with `https://www.googleapis.com/auth/drive.file` scope**.

### Key Advantages:
1. **Zero Audit Fees ($0)**: Google classifies `drive.file` as a **Non-Sensitive Scope** because access is granted *strictly and exclusively* to the single folder/file hand-selected by the studio owner in the native Google Picker UI.
2. **Zero Bandwidth Cost ($0 to FocoMan)**: High-res RAW/JPEG masters (20MB–50MB) are served to client devices using Google's global Edge CDN thumbnails (`https://lh3.googleusercontent.com/d/{id}=w800` for grid, `=w2048` for fullscreen inspection).
3. **Studio Data Privacy**: FocoMan is physically prevented by Google from reading any unselected private files (tax returns, personal photos, or other client folders) in the photographer's Drive.

---

## 2. Technical Architecture & Data Flow

```
1. STUDIO SELECTION (Google Picker UI):
   Studio Owner ──► Clicks "Select Shoot Folder" ──► Native Google Picker Dialog
                                                             │ (User selects 1 folder)
                                                             ▼
                                                    FocoMan receives:
                                                    - Folder ID
                                                    - Access token scoped to that folder

2. METADATA INDEXING (One-time background sync):
   FocoMan Server ──► Queries Drive API v3 (drive.files.list)
                  ──► Retrieves: [{ id, name, thumbnailLink, width, height }]
                  ──► Persists lightweight JSON in Firestore (~150 KB for 3,000 photos)
                  ──► Zero raw image binaries pass through or touch FocoMan servers

3. CLIENT PROOFING (Zero-login tracking portal):
   Client Browser ──► Fetches photo metadata from Firestore
                  ──► Renders virtualized masonry grid (@tanstack/react-virtual)
                  ──► Image binaries stream directly from Google CDN (lh3.googleusercontent.com)
                  ──► Client actions:
                      - Select (Heart / Star)
                      - Reject
                      - Tagging ("Album", "Reception", "Couple Portraits")
                      - Per-photo retouching comments

4. STUDIO LIGHTROOM EXPORT:
   Client Submits ──► Order status transitions to SELECTION_COMPLETED
                  ──► Studio dashboard reveals:
                      - 1-click "Copy Lightroom Filenames" (e.g. IMG_4012.CR3, IMG_4050.CR3)
                      - Export selection summary PDF / CSV
```

---

## 3. Implementation Phasing & Milestones

### Phase 1 (Current MVP Status):
- Studios paste their Google Drive / Dropbox shareable link into Order Deliverables.
- Clients click to access and download with zero API friction.

### Phase 2 (Method B Native Proofing Engine — ~48 to 62 Engineering Hours):
- [ ] **GCP OAuth Setup**: Configure Google Cloud Console project with Google Picker API & `drive.file` scope.
- [ ] **Google Picker Component**: Embed `gapi.picker.PickerBuilder` in the OMS order drawer.
- [ ] **Folder Asset Indexer**: Batch fetch file IDs, names, and thumbnail links with pagination.
- [ ] **Virtualized Photo Grid**: Implement 60fps virtualized masonry gallery (`@tanstack/react-virtual`) in `TrackOrderClient.tsx`.
- [ ] **Lightbox & Commenting**: 2K high-res preview (`sz=w2048`) with per-photo revision notes.
- [ ] **Tagging & Grouping**: Tag management for Album vs Highlights.
- [ ] **Lightroom Filename Formatter**: Quick copy-to-clipboard filter string for album designers.

---

## 4. Google Verification Protocol

- Scope: `https://www.googleapis.com/auth/drive.file`
- Classification: **Non-Sensitive Scope**
- Third-party Audit (CASA Tier 2): **NOT REQUIRED ($0)**
- Review Method: Free automated Google OAuth App verification via a 2-minute unlisted YouTube screencast demonstrating the Google Picker workflow.
