import { readFileSync, writeFileSync, existsSync } from "node:fs";

const manifest = "android/app/src/main/AndroidManifest.xml";
const styles = "android/app/src/main/res/values/styles.xml";

if (!existsSync(manifest)) {
  console.error("Android project is missing. Run `npx cap add android` first.");
  process.exit(1);
}

let xml = readFileSync(manifest, "utf8");
const permission = '<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />';
if (!xml.includes("POST_NOTIFICATIONS")) {
  xml = xml.replace("<manifest", `<manifest`);
  xml = xml.replace(/(<manifest[^>]*>)/, `$1\n    ${permission}`);
  writeFileSync(manifest, xml);
}

if (existsSync(styles)) {
  let sheet = readFileSync(styles, "utf8");
  if (!sheet.includes("android:statusBarColor")) {
    sheet = sheet.replace(
      /(<style name="AppTheme[^"]*"[^>]*>)/,
      `$1\n        <item name="android:statusBarColor">#14120E</item>\n        <item name="android:navigationBarColor">#14120E</item>\n        <item name="android:windowBackground">#14120E</item>`,
    );
    writeFileSync(styles, sheet);
  }
}

console.log("Android project patched.");
