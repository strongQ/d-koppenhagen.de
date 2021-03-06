'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const log_1 = require('@scullyio/scully/utils/log');
const jsdom_1 = require('jsdom');
exports.headingLevel = (tag) => {
  const match = tag.match(/(?!h)[123456]/g);
  return match && match.length ? Number(match[0]) : null;
};
function tocPlugin(html, routeData) {
  const route = routeData.route;
  try {
    const dom = new jsdom_1.JSDOM(html);
    const { window } = dom;
    const tocConfig = routeData.config.toc;
    let tocInsertPointSelector = '#toc';
    if (!tocConfig.insertSelector) {
      log_1.logWarn(
        `No "insertSelector" for "toc" provided, using default: "#id".`,
      );
    } else {
      tocInsertPointSelector = tocConfig.insertSelector;
    }
    const insertPoint = window.document.querySelector(tocInsertPointSelector);
    if (!insertPoint) {
      log_1.logWarn(
        `Insert point with selector ${tocInsertPointSelector} not found. Skipping toc generation for route ${route}.`,
      );
      return html;
    }
    let levels = ['h2', 'h3'];
    if (!tocConfig.level) {
      log_1.logWarn(
        `Option "level" for "toc" not set, using default: "['h2', 'h3']".`,
      );
    } else {
      levels = tocConfig.level;
    }
    const possibleValues = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
    let selector = '';
    levels.forEach((level) => {
      const lowerCased = level.toLowerCase();
      if (possibleValues.indexOf(lowerCased) === -1) {
        log_1.logWarn(
          `Level "${level}" is not valid. It should be one of ${JSON.stringify(
            possibleValues,
          )}.`,
        );
      } else {
        selector += tocConfig.blogAreaSelector
          ? `${tocConfig.blogAreaSelector}>${lowerCased},`
          : `${lowerCased},`;
      }
    });
    selector = selector.replace(/(^,)|(,$)/g, '');
    const headers = window.document.querySelectorAll(selector);
    let previousTag;
    let toc = '';
    headers.forEach((c) => {
      const level = exports.headingLevel(c.tagName);
      const baseLiEl = `<li><a href="${route}#${c.id}">${c.textContent}</a></li>`;
      if (previousTag && level && level > previousTag) {
        toc += '<ul style="margin-bottom: 0px">';
      }
      if (previousTag && level && level < previousTag) {
        toc += '</ul>';
      }
      toc += baseLiEl;
      previousTag = level;
    });
    const list = window.document.createElement('ul');
    list.innerHTML = toc;
    insertPoint.appendChild(list);
    // console.log(toc);
    log_1.log(`successfully added TOC for route '${log_1.yellow(route)}'`);
    return dom.serialize();
  } catch (e) {
    log_1.logWarn(
      `error in tocPlugin, didn't parse for route '${log_1.yellow(route)}'`,
    );
  }
  return html;
}
exports.tocPlugin = tocPlugin;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9jLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3RvYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG9EQUE2RDtBQUM3RCxpQ0FBOEI7QUFHakIsUUFBQSxZQUFZLEdBQUcsQ0FBQyxHQUFXLEVBQWlCLEVBQUU7SUFDekQsTUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0lBQzFDLE9BQU8sS0FBSyxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0FBQ3pELENBQUMsQ0FBQztBQUVGLFNBQWdCLFNBQVMsQ0FBQyxJQUFZLEVBQUUsU0FBMEI7SUFDaEUsTUFBTSxLQUFLLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQztJQUM5QixJQUFJO1FBQ0YsTUFBTSxHQUFHLEdBQUcsSUFBSSxhQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDNUIsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLEdBQUcsQ0FBQztRQUN2QixNQUFNLFNBQVMsR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQztRQUt2QyxJQUFJLHNCQUFzQixHQUFHLE1BQU0sQ0FBQztRQUNwQyxJQUFJLENBQUMsU0FBUyxDQUFDLGNBQWMsRUFBRTtZQUM3QixhQUFPLENBQUMsK0RBQStELENBQUMsQ0FBQztTQUMxRTthQUFNO1lBQ0wsc0JBQXNCLEdBQUcsU0FBUyxDQUFDLGNBQWMsQ0FBQztTQUNuRDtRQUtELE1BQU0sV0FBVyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLHNCQUFzQixDQUFDLENBQUM7UUFFMUUsSUFBSSxDQUFDLFdBQVcsRUFBRTtZQUNoQixhQUFPLENBQ0wsOEJBQThCLHNCQUFzQixpREFBaUQsS0FBSyxHQUFHLENBQzlHLENBQUM7WUFDRixPQUFPLElBQUksQ0FBQztTQUNiO1FBS0QsSUFBSSxNQUFNLEdBQVksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDbkMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUU7WUFDcEIsYUFBTyxDQUNMLGtFQUFrRSxDQUNuRSxDQUFDO1NBQ0g7YUFBTTtZQUNMLE1BQU0sR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDO1NBQzFCO1FBQ0QsTUFBTSxjQUFjLEdBQUcsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzVELElBQUksUUFBUSxHQUFHLEVBQUUsQ0FBQztRQUNsQixNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ3JCLE1BQU0sVUFBVSxHQUFHLEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUN2QyxJQUFJLGNBQWMsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7Z0JBQzdDLGFBQU8sQ0FDTCxVQUFVLEtBQUssdUNBQXVDLElBQUksQ0FBQyxTQUFTLENBQ2xFLGNBQWMsQ0FDZixHQUFHLENBQ0wsQ0FBQzthQUNIO2lCQUFNO2dCQUNMLFFBQVEsSUFBSSxTQUFTLENBQUMsZ0JBQWdCO29CQUNwQyxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsZ0JBQWdCLElBQUksVUFBVSxHQUFHO29CQUNoRCxDQUFDLENBQUMsR0FBRyxVQUFVLEdBQUcsQ0FBQzthQUN0QjtRQUNILENBQUMsQ0FBQyxDQUFDO1FBRUgsUUFBUSxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQzlDLE1BQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLENBQUM7UUFLM0QsSUFBSSxXQUEwQixDQUFDO1FBQy9CLElBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQztRQUNiLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDbEIsTUFBTSxLQUFLLEdBQUcsb0JBQVksQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDdEMsTUFBTSxRQUFRLEdBQUcsZ0JBQWdCLEtBQUssSUFBSSxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxXQUFXLFdBQVcsQ0FBQztZQUM1RSxJQUFJLFdBQVcsSUFBSSxLQUFLLElBQUksS0FBSyxHQUFHLFdBQVcsRUFBRTtnQkFDL0MsR0FBRyxJQUFJLGlDQUFpQyxDQUFDO2FBQzFDO1lBQ0QsSUFBSSxXQUFXLElBQUksS0FBSyxJQUFJLEtBQUssR0FBRyxXQUFXLEVBQUU7Z0JBQy9DLEdBQUcsSUFBSSxPQUFPLENBQUM7YUFDaEI7WUFDRCxHQUFHLElBQUksUUFBUSxDQUFDO1lBQ2hCLFdBQVcsR0FBRyxLQUFLLENBQUM7UUFDdEIsQ0FBQyxDQUFDLENBQUM7UUFLSCxNQUFNLElBQUksR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNqRCxJQUFJLENBQUMsU0FBUyxHQUFHLEdBQUcsQ0FBQztRQUNyQixXQUFXLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBSzlCLE9BQU8sR0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDO0tBQ3hCO0lBQUMsT0FBTyxDQUFDLEVBQUU7UUFDVixhQUFPLENBQUMsK0NBQStDLFlBQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDMUU7SUFFRCxPQUFPLElBQUksQ0FBQztBQUNkLENBQUM7QUE5RkQsOEJBOEZDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgbG9nV2FybiwgeWVsbG93IH0gZnJvbSAnQHNjdWxseWlvL3NjdWxseS91dGlscy9sb2cnO1xuaW1wb3J0IHsgSlNET00gfSBmcm9tICdqc2RvbSc7XG5pbXBvcnQgeyBUb2NIYW5kbGVkUm91dGUsIExldmVsIH0gZnJvbSAnLi9pbnRlcmZhY2VzJztcblxuZXhwb3J0IGNvbnN0IGhlYWRpbmdMZXZlbCA9ICh0YWc6IHN0cmluZyk6IG51bWJlciB8IG51bGwgPT4ge1xuICBjb25zdCBtYXRjaCA9IHRhZy5tYXRjaCgvKD8haClbMTIzNDU2XS9nKTtcbiAgcmV0dXJuIG1hdGNoICYmIG1hdGNoLmxlbmd0aCA/IE51bWJlcihtYXRjaFswXSkgOiBudWxsO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIHRvY1BsdWdpbihodG1sOiBzdHJpbmcsIHJvdXRlRGF0YTogVG9jSGFuZGxlZFJvdXRlKSB7XG4gIGNvbnN0IHJvdXRlID0gcm91dGVEYXRhLnJvdXRlO1xuICB0cnkge1xuICAgIGNvbnN0IGRvbSA9IG5ldyBKU0RPTShodG1sKTtcbiAgICBjb25zdCB7IHdpbmRvdyB9ID0gZG9tO1xuICAgIGNvbnN0IHRvY0NvbmZpZyA9IHJvdXRlRGF0YS5jb25maWcudG9jO1xuXG4gICAgLyoqXG4gICAgICogZGVmaW5lIGluc2VydCBwb2ludFxuICAgICAqL1xuICAgIGxldCB0b2NJbnNlcnRQb2ludFNlbGVjdG9yID0gJyN0b2MnO1xuICAgIGlmICghdG9jQ29uZmlnLmluc2VydFNlbGVjdG9yKSB7XG4gICAgICBsb2dXYXJuKGBObyBcImluc2VydFNlbGVjdG9yXCIgZm9yIFwidG9jXCIgcHJvdmlkZWQsIHVzaW5nIGRlZmF1bHQ6IFwiI2lkXCIuYCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRvY0luc2VydFBvaW50U2VsZWN0b3IgPSB0b2NDb25maWcuaW5zZXJ0U2VsZWN0b3I7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogc2VhcmNoIGZvciBpbnNlcnQgcG9pbnRcbiAgICAgKi9cbiAgICBjb25zdCBpbnNlcnRQb2ludCA9IHdpbmRvdy5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRvY0luc2VydFBvaW50U2VsZWN0b3IpO1xuICAgIC8vIGluIGNhc2UgPGRpdiBpZD1cInRvY1wiPjwvZGl2PiBpcyBub3Qgb24gdGhlIHNpdGVcbiAgICBpZiAoIWluc2VydFBvaW50KSB7XG4gICAgICBsb2dXYXJuKFxuICAgICAgICBgSW5zZXJ0IHBvaW50IHdpdGggc2VsZWN0b3IgJHt0b2NJbnNlcnRQb2ludFNlbGVjdG9yfSBub3QgZm91bmQuIFNraXBwaW5nIHRvYyBnZW5lcmF0aW9uIGZvciByb3V0ZSAke3JvdXRlfS5gLFxuICAgICAgKTtcbiAgICAgIHJldHVybiBodG1sO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGdldCBoZWFkaW5ncyBmb3IgdG9jIGdlbmVyYXRpb25cbiAgICAgKi9cbiAgICBsZXQgbGV2ZWxzOiBMZXZlbFtdID0gWydoMicsICdoMyddO1xuICAgIGlmICghdG9jQ29uZmlnLmxldmVsKSB7XG4gICAgICBsb2dXYXJuKFxuICAgICAgICBgT3B0aW9uIFwibGV2ZWxcIiBmb3IgXCJ0b2NcIiBub3Qgc2V0LCB1c2luZyBkZWZhdWx0OiBcIlsnaDInLCAnaDMnXVwiLmAsXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICBsZXZlbHMgPSB0b2NDb25maWcubGV2ZWw7XG4gICAgfVxuICAgIGNvbnN0IHBvc3NpYmxlVmFsdWVzID0gWydoMScsICdoMicsICdoMycsICdoNCcsICdoNScsICdoNiddO1xuICAgIGxldCBzZWxlY3RvciA9ICcnO1xuICAgIGxldmVscy5mb3JFYWNoKGxldmVsID0+IHtcbiAgICAgIGNvbnN0IGxvd2VyQ2FzZWQgPSBsZXZlbC50b0xvd2VyQ2FzZSgpO1xuICAgICAgaWYgKHBvc3NpYmxlVmFsdWVzLmluZGV4T2YobG93ZXJDYXNlZCkgPT09IC0xKSB7XG4gICAgICAgIGxvZ1dhcm4oXG4gICAgICAgICAgYExldmVsIFwiJHtsZXZlbH1cIiBpcyBub3QgdmFsaWQuIEl0IHNob3VsZCBiZSBvbmUgb2YgJHtKU09OLnN0cmluZ2lmeShcbiAgICAgICAgICAgIHBvc3NpYmxlVmFsdWVzLFxuICAgICAgICAgICl9LmAsXG4gICAgICAgICk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzZWxlY3RvciArPSB0b2NDb25maWcuYmxvZ0FyZWFTZWxlY3RvclxuICAgICAgICAgID8gYCR7dG9jQ29uZmlnLmJsb2dBcmVhU2VsZWN0b3J9PiR7bG93ZXJDYXNlZH0sYFxuICAgICAgICAgIDogYCR7bG93ZXJDYXNlZH0sYDtcbiAgICAgIH1cbiAgICB9KTtcbiAgICAvLyByZW1vdmUgbGVhZGluZyBhbmQgdHJhaWxpbmcgY29tbWFcbiAgICBzZWxlY3RvciA9IHNlbGVjdG9yLnJlcGxhY2UoLyheLCl8KCwkKS9nLCAnJyk7XG4gICAgY29uc3QgaGVhZGVycyA9IHdpbmRvdy5kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKTtcblxuICAgIC8qKlxuICAgICAqIGJ1aWxkIG5lc3RlZCB1bCwgbGkgbGlzdFxuICAgICAqL1xuICAgIGxldCBwcmV2aW91c1RhZzogbnVtYmVyIHwgbnVsbDtcbiAgICBsZXQgdG9jID0gJyc7XG4gICAgaGVhZGVycy5mb3JFYWNoKGMgPT4ge1xuICAgICAgY29uc3QgbGV2ZWwgPSBoZWFkaW5nTGV2ZWwoYy50YWdOYW1lKTtcbiAgICAgIGNvbnN0IGJhc2VMaUVsID0gYDxsaT48YSBocmVmPVwiJHtyb3V0ZX0jJHtjLmlkfVwiPiR7Yy50ZXh0Q29udGVudH08L2E+PC9saT5gO1xuICAgICAgaWYgKHByZXZpb3VzVGFnICYmIGxldmVsICYmIGxldmVsID4gcHJldmlvdXNUYWcpIHtcbiAgICAgICAgdG9jICs9ICc8dWwgc3R5bGU9XCJtYXJnaW4tYm90dG9tOiAwcHhcIj4nO1xuICAgICAgfVxuICAgICAgaWYgKHByZXZpb3VzVGFnICYmIGxldmVsICYmIGxldmVsIDwgcHJldmlvdXNUYWcpIHtcbiAgICAgICAgdG9jICs9ICc8L3VsPic7XG4gICAgICB9XG4gICAgICB0b2MgKz0gYmFzZUxpRWw7XG4gICAgICBwcmV2aW91c1RhZyA9IGxldmVsO1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogYXBwZW5kIHRvYyBhcyBjaGlsZFxuICAgICAqL1xuICAgIGNvbnN0IGxpc3QgPSB3aW5kb3cuZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndWwnKTtcbiAgICBsaXN0LmlubmVySFRNTCA9IHRvYztcbiAgICBpbnNlcnRQb2ludC5hcHBlbmRDaGlsZChsaXN0KTtcblxuICAgIC8qKlxuICAgICAqIHJldHVybiBuZXcgc2VyaWFsaXplZCBIVE1MXG4gICAgICovXG4gICAgcmV0dXJuIGRvbS5zZXJpYWxpemUoKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGxvZ1dhcm4oYGVycm9yIGluIHRvY1BsdWdpbiwgZGlkbid0IHBhcnNlIGZvciByb3V0ZSAnJHt5ZWxsb3cocm91dGUpfSdgKTtcbiAgfVxuICAvLyBpbiBjYXNlIG9mIGZhaWx1cmUgcmV0dXJuIHVuY2hhbmdlZCBIVE1MIHRvIGtlZXAgZmxvdyBnb2luZ1xuICByZXR1cm4gaHRtbDtcbn1cbiJdfQ==
