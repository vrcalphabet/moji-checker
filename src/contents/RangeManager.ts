import { charRange } from './data/charRange';
import { VariationType } from './types/VariationType';

export type Range = [start: number, end: number][];

export class RangeManager {
  /** 変更される文字の範囲 */
  private static CHANGE = this.parseRange(charRange.change);
  /** 保持される文字の範囲 */
  private static PRESERVE = this.parseRange(charRange.preserve);
  /** 装飾文字の範囲 */
  private static VARIATIONS = this.parseRange(charRange.variations);

  /** 文字コードの範囲を数値化する */
  private static parseRange(rangeList: string): Range {
    return rangeList.split(',').map((range) => {
      const splitRange = range.split('-');
      const start = splitRange[0];
      const end = splitRange[1] ?? splitRange[0];
      return [parseInt(start, 16), parseInt(end, 16)];
    });
  }

  /** コードポイントが範囲内にあるかどうかをチェックする */
  private static isInRange(codePoint: number, range: Range): boolean {
    return range.some(([start, end]) => codePoint >= start && codePoint <= end);
  }

  /** コードポイントに基づいたステートを取得する */
  static getRangeType(codePoint: number): VariationType {
    if (this.isInRange(codePoint, this.VARIATIONS)) {
      return VariationType.VARIATIONS;
    } else if (this.isInRange(codePoint, this.CHANGE)) {
      return VariationType.CHANGE;
    } else if (this.isInRange(codePoint, this.PRESERVE)) {
      return VariationType.PRESERVE;
    } else {
      return VariationType.REMOVE;
    }
  }
}
