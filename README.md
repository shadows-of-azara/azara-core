## Shadows of Azara

### Development Set Up

- cd into your TS-WoW installation directory `modules` folder.
- Delete any other modules present.
- `git clone git@github.com:shadows-of-azara/azara-core.git azara-core`
- In your TS-WoW directory find `node.conf` and set the following.
    - Default.Client = "C:\\PathToClient\\Here"
    - Default.Realm = "azara-core.realm"
    - Default.Dataset = "azara-core.dataset"
    - AutoStart.Realms = ["azara-core.realm"]
- Open VS Code and open your TS-WoW directory folder.
- In the window click Terminal -> New Terminal
- `npm run start`

It is very likely that it will extract files at this point. Annoying but can't be avoided. You may also get a lot of errors. That's fine. It should still reach a point like below. 

```
[23:45:52][realm/azara-core.realm] Starting up anti-freeze thread (60 seconds max stuck time)...
[23:45:52][realm/azara-core.realm] TrinityCore rev. 395de7ea1e52 2024-10-12 09:18:37 +0200 (tswow branch) (Win64, RelWithDebInfo, Dynamic) (worldserver-daemon) ready...
[23:45:52][realm/azara-core.realm] TC>
>
```

Once it has the next step is to run `build all`.

This will apply DBC, SQL, C++ edits etc. 