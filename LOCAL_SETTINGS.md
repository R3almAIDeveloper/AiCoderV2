# Local Settings Database

R3alm Dev uses browser localStorage for user preferences and settings. This guide explains how the local database works.

## Overview

The local settings database stores user preferences locally on their device using the HTML5 localStorage API. These settings are device-specific and do not sync across devices.

## Storage Locations

### Settings Keys

- **`r3alm_dev_settings`**: Main user preferences
- **`r3alm_dev_sidebar_state`**: Sidebar collapsed/expanded state
- **`r3alm_dev_recent_projects`**: List of recently accessed projects

## Available Settings

### Theme Settings
- `theme`: 'dark' | 'light' (default: 'dark')

### Editor Settings
- `editorFontSize`: number (10-20, default: 14)
- `editorLanguage`: string (default: 'typescript')
- `editorIndentSize`: number (2, 4, or 8, default: 2)
- `editorIndentType`: 'spaces' | 'tabs' (default: 'spaces')
- `wordWrap`: boolean (default: true)
- `minimap`: boolean (default: true)

### Auto-Save Settings
- `autoSave`: boolean (default: true)
- `autoSaveInterval`: number in ms (default: 5000)

### General Settings
- `previewLayout`: 'split' | 'stacked' | 'tab' (default: 'split')
- `notifications`: boolean (default: true)
- `developmentMode`: boolean (default: false)
- `sidebarCollapsed`: boolean (default: false)

## API Reference

The local database API is available through `localDB` object in `src/lib/localStorage.ts`:

### Settings API

```typescript
// Get all settings
const allSettings = localDB.settings.get();

// Update multiple settings
localDB.settings.set({
  theme: 'light',
  editorFontSize: 16
});

// Get a single setting
const fontSize = localDB.settings.getSingle('editorFontSize');

// Set a single setting
localDB.settings.setSingle('editorFontSize', 16);

// Reset to defaults
localDB.settings.reset();
```

### Sidebar State API

```typescript
// Get sidebar state
const isCollapsed = localDB.sidebarState.get();

// Set sidebar state
localDB.sidebarState.set(true); // true = collapsed
```

### Recent Projects API

```typescript
// Get recent projects
const recentIds = localDB.recentProjects.get(); // Returns array of project IDs

// Add to recent projects
localDB.recentProjects.add('project-id-123');

// Clear recent projects
localDB.recentProjects.clear();
```

### Global Operations

```typescript
// Clear all local data
localDB.clear();
```

## Using Settings in Components

### Using the Settings Context Hook

```typescript
import { useSettings } from '../contexts/SettingsContext';

export const MyComponent: React.FC = () => {
  const { settings, updateSettings, setSetting } = useSettings();

  return (
    <button onClick={() => setSetting('theme', 'light')}>
      Current theme: {settings.theme}
    </button>
  );
};
```

### Using the Local Database Directly

```typescript
import { localDB } from '../lib/localStorage';

export const MyComponent: React.FC = () => {
  const fontSize = localDB.settings.getSingle('editorFontSize');

  return <div>Font size: {fontSize}px</div>;
};
```

## Settings Page

Users can manage settings through the Settings page accessible at `/settings`.

The Settings page includes:
- **Account**: Email and logout button
- **Appearance**: Theme selection (dark/light)
- **Editor**: Font size, indent settings, language, word wrap, minimap
- **General**: Auto-save, notifications, preview layout
- **Reset**: Reset all settings to defaults

## Storage Limits

Browser localStorage typically has these limits:
- Chrome/Firefox: ~10MB per origin
- Safari: ~5MB per origin
- IE: ~10MB per origin

R3alm Dev settings use minimal storage (typically <1KB).

## Data Persistence

- Settings are persisted immediately when changed
- Settings survive browser restarts and app updates
- Settings are specific to each domain/origin
- Settings can be cleared by clearing browser cache/cookies

## Cross-Tab Communication

When settings are updated in one tab, other tabs are notified through the storage event listener in `SettingsContext`. This allows real-time synchronization across tabs.

## Export/Import Settings

Settings can be exported and imported for backup or sharing:

```typescript
// Export all settings
const settings = localDB.settings.get();
const json = JSON.stringify(settings);
// Save json to file or share...

// Import settings
const importedSettings = JSON.parse(jsonString);
localDB.settings.set(importedSettings);
```

## Troubleshooting

### Settings Not Persisting

1. Check if localStorage is enabled in browser
2. Verify browser storage quota is not exceeded
3. Check browser console for storage errors
4. Clear browser cache and try again

### Settings Reverted

1. This typically means localStorage was cleared
2. Check Privacy/Incognito mode - settings won't persist
3. Check if browser privacy settings are blocking storage

### Performance Issues

If localStorage operations are slow:
1. Reduce frequency of updates
2. Batch multiple updates together
3. Consider moving data to IndexedDB for larger datasets

## Security Considerations

- Settings are stored in plain text in localStorage
- Do NOT store sensitive data in localStorage
- Never store passwords, API keys, or tokens here
- localStorage is accessible to any script on the page

## Migration Guide

If updating the UserSettings interface:

1. Update types in `src/lib/localStorage.ts`
2. Update default values in `defaultSettings`
3. Settings will automatically merge with new defaults on first access
4. Existing users keep their current settings

## Example: Adding a New Setting

To add a new setting:

1. **Update the type** in `src/lib/localStorage.ts`:
```typescript
interface UserSettings {
  // ... existing settings
  newSetting: string;
}
```

2. **Add default value**:
```typescript
const defaultSettings: UserSettings = {
  // ... existing defaults
  newSetting: 'default-value',
};
```

3. **Use in component**:
```typescript
const { settings, setSetting } = useSettings();
setSetting('newSetting', 'new-value');
```

## Best Practices

1. **Always use the Settings context** - This ensures consistency and cross-tab updates
2. **Don't read from localStorage directly** - Use the API instead
3. **Batch updates** - Update multiple settings at once when possible
4. **Handle missing values** - Always provide defaults
5. **Test storage changes** - Verify settings persist across page reloads
6. **Document new settings** - Update this file when adding new settings

## Advanced: Custom Storage Backends

To use IndexedDB or other storage instead:

1. Create new storage implementation in `src/lib/storage.ts`
2. Update `localDB` to use new backend
3. Keep the same API interface

Example:
```typescript
// Using IndexedDB
const db = await openDB('r3alm-dev');
export const localDB = {
  settings: {
    get: () => db.get('settings'),
    set: (s) => db.put('settings', s),
    // ... rest of API
  }
};
```

---

For more information, see:
- [MDN: localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [MDN: StorageEvent](https://developer.mozilla.org/en-US/docs/Web/API/StorageEvent)
- [Web Storage API](https://html.spec.whatwg.org/multipage/webstorage.html)
