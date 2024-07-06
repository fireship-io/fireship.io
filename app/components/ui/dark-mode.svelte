<svelte:options customElement="dark-mode-toggle" />

<script lang="ts">
  import {
    doesPreferDark,
  } from "../../stores/preferred-theme";
  import type { SettableBoolean } from "../../stores/preferred-theme";
  import { onMount } from "svelte";

  enum LightMode {
    DARK = 0,
    LIGHT = 1,
    SYSTEM = 2,
  }

  const mode = (preferDark: SettableBoolean): LightMode =>
    ((preferDark: boolean | LightMode.SYSTEM): LightMode => {
      if (preferDark === LightMode.SYSTEM) return preferDark;
      return preferDark ? LightMode.DARK : LightMode.LIGHT;
    })(preferDark ?? 2);

  const isDark = (m: LightMode): boolean =>
    m === LightMode.SYSTEM
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
      : m === LightMode.DARK;

  const htmlBase = document.documentElement;
  function changeDarkClass(m: LightMode) {
    if (isDark(m)) htmlBase.classList.add("dark");
    else htmlBase.classList.remove("dark");
  }
  let cachedMode: LightMode = mode($doesPreferDark);
  onMount(() => {
    changeDarkClass(cachedMode);
  });
  function toggle() {
    const nextMode = (cachedMode + 1) % 3;
    doesPreferDark.set(
      nextMode === LightMode.SYSTEM ? null : nextMode === LightMode.DARK,
    );
    changeDarkClass(nextMode);
    cachedMode = nextMode;
  }
</script>

<!-- TODO: internationalize that with go template in layout -->
<button
  title={["Sombre", "Clair", "Sync Système"][mode($doesPreferDark)]}
  on:click={toggle}>{["🎑", "🌅", "💻"][mode($doesPreferDark)]}</button
>
