<script lang="ts">
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import Icon from "@iconify/svelte";
import { getDefaultHue, getHue, setHue } from "@utils/setting-utils";

let hue = getHue();
const defaultHue = getDefaultHue();

function resetHue() {
	hue = getDefaultHue();
}

$: if (hue || hue === 0) {
	setHue(hue);
}
</script>

<div id="display-setting" class="float-panel float-panel-closed absolute transition-all w-80 right-4 px-4 py-4">
    <div class="flex flex-row gap-2 mb-3 items-center justify-between">
        <div class="flex gap-2 font-mono text-sm font-medium tracking-wide text-white/60 transition relative ml-3
            before:w-px before:h-4 before:bg-cyan-400/40
            before:absolute before:-left-3 before:top-[0.33rem]"
        >
            {i18n(I18nKey.themeColor)}
            <button aria-label="Reset to Default" class="glass-control flex h-7 w-7 items-center justify-center will-change-transform"
                    class:opacity-0={hue === defaultHue} class:pointer-events-none={hue === defaultHue} on:click={resetHue}>
                <Icon icon="fa6-solid:arrow-rotate-left" class="text-[0.875rem] text-white/45"></Icon>
            </button>
        </div>
        <div class="flex gap-1">
            <div id="hueValue" class="flex h-7 w-10 items-center justify-center border border-white/10 bg-white/[0.04] font-mono text-xs text-white/50">
                {hue}
            </div>
        </div>
    </div>
    <div class="hue-slider-track w-full h-6 px-1 select-none">
        <input aria-label={i18n(I18nKey.themeColor)} type="range" min="0" max="360" bind:value={hue}
               class="slider" id="colorSlider" step="5" style="width: 100%">
    </div>
</div>


<style lang="stylus">
    .hue-slider-track
      background linear-gradient(90deg, rgba(115, 115, 115, 0.35) 0%, rgba(186, 230, 253, 0.45) 50%, rgba(212, 212, 212, 0.4) 100%)
      border 1px solid rgba(255, 255, 255, 0.08)

    #display-setting
      input[type="range"]
        -webkit-appearance none
        height 1.5rem
        background transparent
        transition opacity 0.3s ease

        /* Input Thumb */
        &::-webkit-slider-thumb
          -webkit-appearance none
          height 1rem
          width 0.5rem
          border-radius 0
          background rgba(212, 212, 212, 0.85)
          box-shadow none
          &:hover
            background rgba(165, 243, 252, 0.95)
          &:active
            background rgba(255, 255, 255, 0.75)

        &::-moz-range-thumb
          height 1rem
          width 0.5rem
          border-radius 0
          border-width 0
          background rgba(212, 212, 212, 0.85)
          box-shadow none
          &:hover
            background rgba(165, 243, 252, 0.95)
          &:active
            background rgba(255, 255, 255, 0.75)

        &::-ms-thumb
          height 1rem
          width 0.5rem
          border-radius 0
          background rgba(212, 212, 212, 0.85)
          box-shadow none
          &:hover
            background rgba(165, 243, 252, 0.95)
          &:active
            background rgba(255, 255, 255, 0.75)

</style>
