export default class Canvas
{
    static _canvasToDisplaySizeMap = new Map([[canvas, [300, 150]]]);

    constructor(canvas)
    {
        this._canvas = canvas;
        this._resizeObserver = new ResizeObserver(this._onResize);
        this._resizeObserver.observe(canvas, {box: 'content-box'});
        //console.log(globalThis.canvas);
    }

    get context()
    {
        return this._canvas.getContext("webgl2");
    }

    get height()
    {
        return this._canvas.height;
    }

    get width()
    {
        return this._canvas.width;
    }

    resizeToDisplaySize()
    {
        const canvas = this._canvas;
        const [displayWidth, displayHeight] = Canvas._canvasToDisplaySizeMap.get(canvas);
        const needResize = canvas.width  != displayWidth || canvas.height != displayHeight;

        if (needResize)
        {
            canvas.width  = displayWidth;
            canvas.height = displayHeight;
        }

        return needResize;
    }

    _onResize(entries)
    {
        for (const entry of entries)
        {
            let width;
            let height;
            let dpr = window.devicePixelRatio;

            if (entry.devicePixelContentBoxSize)
            {
                // NOTE: Only this path gives the correct answer
                // The other paths are imperfect fallbacks
                // for browsers that don't provide anyway to do this
                width = entry.devicePixelContentBoxSize[0].inlineSize;
                height = entry.devicePixelContentBoxSize[0].blockSize;
                dpr = 1; // it's already in width and height
            }
            else if (entry.contentBoxSize)
            {
                if (entry.contentBoxSize[0])
                {
                    width = entry.contentBoxSize[0].inlineSize;
                    height = entry.contentBoxSize[0].blockSize;
                }
                else
                {
                    width = entry.contentBoxSize.inlineSize;
                    height = entry.contentBoxSize.blockSize;
                }
            }
            else
            {
                width = entry.contentRect.width;
                height = entry.contentRect.height;
            }

            const displayWidth = Math.round(width * dpr);
            const displayHeight = Math.round(height * dpr);
            Canvas._canvasToDisplaySizeMap.set(entry.target, [displayWidth, displayHeight]);
        }
    }
}