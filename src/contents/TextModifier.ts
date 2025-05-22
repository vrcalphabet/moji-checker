import { RangeManager } from './RangeManager';
import { VariationType } from './types/VariationType';

export class TextModifier {
  /** 文字を強調する */
  static highlight(layer: HTMLElement, text: string) {
    this.clear(layer);
    if (!text) return;

    let buffer = '';
    let state: VariationType = VariationType.PRESERVE; // 初期状態は保持
    let spaceCount = 0;
    let newlineCount = 0;

    // テキストを1文字ずつ処理
    for (let i = 0; i < text.length; i++) {
      let char = text[i];
      const nextChar = text[i + 1] ?? '';

      // ステートを取得
      let currCharState = RangeManager.getRangeType(char.codePointAt(0)!);
      const nextCharState = RangeManager.getRangeType(nextChar.codePointAt(0)!);

      // スペースの連続をチェック
      if (this.isSpace(char)) {
        spaceCount++;
        // 2文字目以降のスペースは削除される
        if (spaceCount >= 2) {
          currCharState = VariationType.REMOVE;
        }
      } else {
        // 連続していないならカウントをリセット
        spaceCount = 0;
      }

      // 改行の連続をチェック
      if (this.isNewline(char)) {
        newlineCount++;
        // 3文字目以降の改行は削除される
        if (newlineCount >= 3) {
          char = ' \n'; // 削除を視覚的に示すためにスペースを追加
          currCharState = VariationType.REMOVE;
        }
      } else {
        // 連続していないならカウントをリセット
        newlineCount = 0;
      }

      if (currCharState === VariationType.REMOVE) {
        // 文字が削除される場合
        if (state !== VariationType.REMOVE) {
          this.pushText(layer, buffer, state);
          buffer = '';
        }
        state = VariationType.REMOVE;
      } else if (
        nextCharState === VariationType.VARIATIONS ||
        currCharState === VariationType.CHANGE
      ) {
        // 文字が変更または装飾される場合
        if (state !== VariationType.CHANGE) {
          this.pushText(layer, buffer, state);
          buffer = '';
        }
        state = VariationType.CHANGE;
      } else {
        // 文字が保持される場合
        if (state !== VariationType.PRESERVE) {
          this.pushText(layer, buffer, state);
          buffer = '';
        }
        state = VariationType.PRESERVE;
      }

      buffer += char;
    }

    // 最後のバッファを追加
    this.pushText(layer, buffer, state);
  }

  /** 空白をチェックする */
  private static isSpace(char: string) {
    return char === ' ' || char === '　' || char === '\t';
  }

  /** 改行をチェックする */
  private static isNewline(char: string) {
    return char === '\n';
  }

  /** レイヤを空にする */
  private static clear(layer: HTMLElement) {
    while (layer.firstChild) {
      layer.removeChild(layer.firstChild);
    }
  }

  /** テキストをレイヤに追加する */
  private static pushText(layer: HTMLElement, text: string, state: VariationType) {
    if (!text) return;

    if (state === VariationType.PRESERVE) {
      // 保持される場合は普通にテキストを追加
      const textNode = document.createTextNode(text);
      layer.append(textNode);
    } else {
      // 変更または削除される場合は、背景色を付けるクラスを指定
      const span = document.createElement('span');
      span.innerText = text;
      span.className = state === VariationType.REMOVE ? '__MC__color-red' : '__MC__color-yellow';
      layer.append(span);
    }
  }
}
