import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { Platform } from "@ionic/angular";
import { Storage } from '@ionic/storage';
import * as Color from 'color';
import { DeviceInfo } from "./device-info";

// npm i color

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private storage: Storage, private statusBar: StatusBar, private platform: Platform, private device: DeviceInfo) {
    storage.get('theme').then(cssText => {
      this.setGlobalCSS(cssText);
    });
  }

  // Override all global variables with a new theme
  setTheme(theme: ITheme, updateStatusBar: boolean = true) {
    const cssText = CSSTextGenerator(theme);
    this.setGlobalCSS(cssText);
    this.storage.set('theme', cssText);

    if (updateStatusBar)
      this.updateStatusBar(theme);
  }

  updateStatusBar(theme: ITheme) {
    this.platform.ready().then(() => {
      this.statusBar.styleLightContent();
      this.statusBar.backgroundColorByHexString(theme.primary);
    });
  }

  // Define a single CSS variable
  setVariable(name, value) {
    this.document.documentElement.style.setProperty(name, value);
  }

  getThemeBasedOffDefaults(): ITheme {
    return {
      primary: themeDefaults.primary,
      secondary: themeDefaults.secondary,
      tertiary: themeDefaults.tertiary,
      success: themeDefaults.success,
      warning: themeDefaults.warning,
      danger: themeDefaults.danger,
      dark: themeDefaults.dark,
      medium: themeDefaults.medium,
      light: themeDefaults.light,
    };
  }

  private setGlobalCSS(css: string) {
    this.document.documentElement.style.cssText = css;
  }

  get storedTheme() {
    return this.storage.get('theme');
  }

  /**Returns true if this app is built as the PSG Assist app. */
  // public async isPsgAssist(): Promise<boolean> {
  //   if (this.device.isCordova) {
  //     let packageName = await this.appVersion.getPackageName();
  //     return packageName === "com.clc.psgassist";
  //   }

  //   return true;
  // }
}

export interface ITheme {
  primary: string;
  secondary: string;
  tertiary: string;
  success: string;
  warning: string;
  danger: string;
  dark: string;
  medium: string;
  light: string;
}

export const themeDefaults: ITheme = {
  primary: '#0f1656',
  secondary: '#3880ff',
  tertiary: '#7044ff',
  success: '#10dc60',
  warning: '#ffce00',
  danger: '#f04141',
  dark: '#222428',
  medium: '#989aa2',
  light: '#f4f5f8'
};

function CSSTextGenerator(colors) {
  colors = { ...themeDefaults, ...colors };

  const {
    primary,
    secondary,
    tertiary,
    success,
    warning,
    danger,
    dark,
    medium,
    light
  } = colors;

  const shadeRatio = 0.1;
  const tintRatio = 0.1;

  // --ion-color-base: ${light};
  // --ion-color-contrast: ${dark};
  // --ion-background-color: ${light};
  // --ion-text-color: ${dark};
  // --ion-toolbar-background-color: ${contrast(light, 0.1)};
  // --ion-toolbar-text-color: ${contrast(dark, 0.1)};
  // --ion-item-background-color: ${contrast(light, 0.3)};
  // --ion-item-text-color: ${contrast(dark, 0.3)};

  return `
    --ion-color-primary: ${primary};
    --ion-color-primary-rgb: ${hex2rgb(primary)};
    --ion-color-primary-contrast: ${contrast(primary)};
    --ion-color-primary-contrast-rgb: ${hex2rgb(contrast(primary))};
    --ion-color-primary-shade:  ${darken(primary, shadeRatio)};
    --ion-color-primary-tint:  ${lighten(primary, tintRatio)};
    --ion-color-secondary: ${secondary};
    --ion-color-secondary-rgb: ${hex2rgb(secondary)};
    --ion-color-secondary-contrast: ${contrast(secondary)};
    --ion-color-secondary-contrast-rgb: ${hex2rgb(contrast(secondary))};
    --ion-color-secondary-shade:  ${darken(secondary, shadeRatio)};
    --ion-color-secondary-tint: ${lighten(secondary, tintRatio)};
    --ion-color-tertiary:  ${tertiary};
    --ion-color-tertiary-rgb: ${hex2rgb(tertiary)};
    --ion-color-tertiary-contrast: ${contrast(tertiary)};
    --ion-color-tertiary-contrast-rgb:  ${hex2rgb(contrast(tertiary))};
    --ion-color-tertiary-shade: ${darken(tertiary, shadeRatio)};
    --ion-color-tertiary-tint:  ${lighten(tertiary, tintRatio)};
    --ion-color-success: ${success};
    --ion-color-success-rgb:  ${hex2rgb(success)};
    --ion-color-success-contrast: ${contrast(success)};
    --ion-color-success-contrast-rgb:  ${hex2rgb(contrast(success))};
    --ion-color-success-shade: ${darken(success, shadeRatio)};
    --ion-color-success-tint: ${lighten(success, tintRatio)};
    --ion-color-warning: ${warning};
    --ion-color-warning-rgb: ${hex2rgb(warning)};
    --ion-color-warning-contrast: ${contrast(warning)};
    --ion-color-warning-contrast-rgb:  ${hex2rgb(contrast(warning))};
    --ion-color-warning-shade: ${darken(warning, shadeRatio)};
    --ion-color-warning-tint: ${lighten(warning, tintRatio)};
    --ion-color-danger: ${danger};
    --ion-color-danger-rgb: ${hex2rgb(danger)};
    --ion-color-danger-contrast: ${contrast(danger)};
    --ion-color-danger-contrast-rgb:  ${hex2rgb(contrast(danger))};
    --ion-color-danger-shade: ${darken(danger, shadeRatio)};
    --ion-color-danger-tint: ${lighten(danger, tintRatio)};
    --ion-color-dark: ${dark};
    --ion-color-dark-rgb: ${hex2rgb(dark)};
    --ion-color-dark-contrast: ${contrast(dark)};
    --ion-color-dark-contrast-rgb:  ${hex2rgb(contrast(dark))};
    --ion-color-dark-shade: ${darken(dark, shadeRatio)};
    --ion-color-dark-tint: ${lighten(dark, tintRatio)};
    --ion-color-medium: ${medium};
    --ion-color-medium-rgb:  ${hex2rgb(medium)};
    --ion-color-medium-contrast: ${contrast(medium)};
    --ion-color-medium-contrast-rgb: ${hex2rgb(contrast(medium))};
    --ion-color-medium-shade: ${darken(medium, shadeRatio)};
    --ion-color-medium-tint: ${lighten(medium, tintRatio)};
    --ion-color-light: ${light};
    --ion-color-light-rgb: ${hex2rgb(light)};
    --ion-color-light-contrast: ${contrast(light)};
    --ion-color-light-contrast-rgb: ${hex2rgb(contrast(light))};
    --ion-color-light-shade: ${darken(light, shadeRatio)};
    --ion-color-light-tint: ${lighten(light, tintRatio)};`;
}

/**Calculate contrast should be white or black.  Lower threshold equals more dark text on dark background. */
function contrast(color, threshold = 130) {
  color = Color(color);
  let rgb = color.rgb().array();

  //Color brightness is determined by the following formula:
  //  ((Red value X 299) + (Green value X 587) + (Blue value X 114)) / 1000

  let cBrightness = ((rgb[0] * 299) + (rgb[1] * 587) + (rgb[2] * 114)) / 1000;
  if (cBrightness > threshold)
    return "#000000";
  else
    return "#ffffff";
}

function darken(color, ratio) {
  color = Color(color).darken(ratio);
  return color.hex();
}

function lighten(color, ratio) {
  color = Color(color).lighten(ratio);
  return color.hex();
}

// hex2rgb, modified from
// https://gist.github.com/ecasilla/f8297086161a5cd94bf3
// to return comma separated string or null for invalid color
//
function hex2rgb(hex) {
  if (/^#/.test(hex)) {
    hex = hex.slice(1);
  }
  if (hex.length !== 3 && hex.length !== 6)
    return null;

  var digit = hex.split("");

  if (digit.length === 3) {
    digit = [digit[0], digit[0], digit[1], digit[1], digit[2], digit[2]]
  }
  var r = parseInt([digit[0], digit[1]].join(""), 16);
  var g = parseInt([digit[2], digit[3]].join(""), 16);
  var b = parseInt([digit[4], digit[5]].join(""), 16);

  if (r === NaN || g === NaN || b === NaN)
    return null;

  return "" + r + "," + g + "," + b;
}