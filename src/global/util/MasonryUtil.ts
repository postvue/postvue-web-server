import { breakPointColumns } from 'components/layouts/masonry/Masonry';

class MasonryUtil {
  public caculateColumnCount(
    windowWidth: number,
    breakPointOption: breakPointColumns,
    fixNum?: number,
  ): number {
    let validWidth = Number.MAX_SAFE_INTEGER;
    let columnCount = breakPointOption.default || 5;

    if (fixNum) {
      return fixNum;
    }

    for (const breakPoint in breakPointOption) {
      const bp = Number(breakPoint);

      if (validWidth < bp) break;
      if (windowWidth <= bp) {
        validWidth = bp;
        columnCount = breakPointOption[breakPoint];
      }
    }

    return columnCount;
  }
}

export default MasonryUtil;
