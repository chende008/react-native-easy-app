// Type definitions for RFWidget.js
// Project: [LIBRARY_URL_HERE]
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

/**
 *
 */
export class RFWidget {
  /**
   *
   * @param imageBaseUrl
   */
  initResource(imageBaseUrl: string): RFWidget;

  /**
   *
   * @param targetWidth
   * @param targetHeight
   */
  initReferenceScreen(targetWidth: number, targetHeight: number): RFWidget;
}
