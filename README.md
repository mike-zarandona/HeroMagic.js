# HeroMagic.js
> A jQuery visual effects plugin for fades, slides, and transitions.

Requires jQuery, a child-like sense of wonder, and your good looks.


&nbsp;
## Magic Attributes for Intro Animations
_Appear_ and _move_ intro animated effects are applied using `data-` attributes. They look like this:

```html
<p data-appear="[duration], [easing], [delay]">...</p>
<a data-move="[x],[y], [duration], [easing], [delay]">...</a>
```

...or in a more real example:

```html
<!-- wait 100ms, then fade in over 300ms using the `ease-in-out` easing -->
<h1 data-appear="300ms, ease-in-out, 100ms">One</h1>

<!-- wait 500ms, then move up 20px over 300ms using the `ease-in-out` easing -->
<h2 data-move="-20px, 0, 300ms, ease-in-out, 500ms">Two</h2>
```


&nbsp;
## Magic Classes for Scrolling
The four effects _fade in_, _fade out_, _scroll in_, and _scroll out_ are controlled by classes.

| Class | Effect |
| --- | --- |
| `.hm-fade-in` | As this element moves away from the bottom of the viewport, it will fade in according to the `scrollInDistance` option |
| `.hm-fade-out` | As this element approaches the top of the viewport, it will fade out according to the `scrollOutDistance` option |
| `.hm-scroll-in` | As this element moves away from the bottom of the viewport, it will decelerate in according to the `scrollInDistance` option |
| `.hm-scroll-out` | As this element approaches the top of the viewport, it will accelerate out according to the `scrollOutDistance` option |

**Note:** that all four of these classes are affected by the `scrollCompressor` option for configuring how aggressively the elements accelerate / decelerate.


&nbsp;
## Options
| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `addStyles` | _bool_ | `true` | When `true`, _HeroMagic_ will inject styles into the `<head/>` of the document. It is recommended that you include `jquery.heromagic.css` in your styles and set this option to `false` for better visual performance. |
| `autoStart` | _boolean_ | `true` | If set to `true`, the _appear_ and _move_ animations will begin on the `window.load` event. If this is set to `false` you will need to programmatically invoke the `animate()` method to start the show. |
| `debugScrollPoints` | _bool_ | `false` | If set to `true`, visual indicators of the scroll points used for `.hm-fade-in`, `.hm-fade-out`, `.hm-scroll-in`, and `.hm-scroll-out` will be shown. |
| `defaults` | _object_ | (_see below_) | An object comprising of default options for _appear_s and _move_s. |
| `defaults.appearDuration` | _string_ | `"300ms"` | The time it takes for an `.appear` class to appear. |
| `defaults.appearEasing` | _string_ | `"ease-in-out"` | The easing function used for `.appear`s. |
| `defaults.appearDelay` | _string_ | `"0ms"` | The delay before appearing. |
| `defaults.moveX` | _string_ | `"0"` | The movement of this element on the X axis. |
| `defaults.moveY` | _string_ | `"-20px"` | The movement of this element on the Y axis. |
| `defaults.moveDuration` | _string_ | `"300ms"` | The time it takes for a `.move` class to move. |
| `defaults.moveEasing` | _string_ | `"ease-in-out"` | The easing function used for `.move`s. |
| `defaults.moveDelay` | _string_ | `"0ms"` | The delay before moving. |
| `positionOverrides` | _bool_ | `true` | A setting which will if `true` will change the display property of any element which HeroMagic touches. This will change a `position` value of `static`&#124;`fixed`&#124;`initial`&#124;`inherit` to `relative` (`position: absolute` will remain unchanged). |
| `scrollCompressor` | _float_ | `0.2` | Controls how aggressively the _scroll-in_&#124;_scroll-out_&#124;_fade-in_&#124;_fade-out_ is calculated. Lower numbers go slower, numbers closer to 1.0 start to become seizure-inducing.
| `scrollInDistance` | _int_ | `80` | The distance from the top of the viewport where scrolls + fades start to take effect. |
| `scrollOutDistance` | _int_ | `80` | The distance from the bottom of the viewport where scrolls + fades start to take effect. |
