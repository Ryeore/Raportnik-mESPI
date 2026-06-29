import React, { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { WebView } from "react-native-webview";
import { registerDriver, deliverHtml } from "@/services/PapWebFetcher";

const POST_HTML = `(function(){
  try { window.ReactNativeWebView.postMessage(document.documentElement.outerHTML); } catch(e) {}
})(); true;`;

/**
 * Off-screen WebView used to run espiebi.pap.pl's Incapsula challenge and
 * return rendered HTML. Mount once at the app root. Keeps cookies so later
 * fetches skip the challenge.
 */
export function PapBrowser() {
  const ref = useRef<WebView>(null);
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    registerDriver({ load: (u) => setUrl(`${u}#${Date.now()}`) });
    return () => registerDriver(null);
  }, []);

  if (!url) return null;

  return (
    <View style={{ width: 0, height: 0, position: "absolute", opacity: 0 }} pointerEvents="none">
      <WebView
        ref={ref}
        source={{ uri: url }}
        javaScriptEnabled
        domStorageEnabled
        sharedCookiesEnabled
        thirdPartyCookiesEnabled
        injectedJavaScript={POST_HTML}
        onMessage={(e) => {
          const html = e.nativeEvent.data || "";
          // Ignore the Incapsula challenge page; it reloads into real content.
          if (/_Incapsula_Resource|Incapsula incident/i.test(html) && !/class="[^"]*\bnews\b/.test(html)) return;
          deliverHtml(html);
        }}
      />
    </View>
  );
}
