# 08 — WhatsApp Configuration CRUD & Operational Settings

**System:** Focoman Backend Architecture  
**Date:** 2026-09-18  
**Status:** SPECIFIED  

---

## 1. Entity: `StudioWhatsappConfig`

### Operations Required
- `getStudioWhatsappConfigAction`: Returns current operational notification triggers.
- `updateStudioWhatsappConfigAction`: Sets notification trigger preferences on the studio document.
- `resetStudioWhatsappConfigAction`: Clears or restores default notification preferences.

### Separation of Concerns
- The operational configuration controls which lifecycle events (e.g. event reminder, RAW photos ready, album ready, payment reminder) trigger automated notifications.
- The external WhatsApp Business API gateway integration is decoupled from this settings repository.
