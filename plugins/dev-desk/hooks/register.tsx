import type { Register } from 'claude-code'

// Pixel art from savvy-progress's crab (30x28 grid); one SVG row, compositor CSS only.
const CLAY = '#D97757'
const INK = '#1F1E1D'
const ACCENT = '#378ADD'
const SCALE = 1.6
const H = Math.round(30 * SCALE)
const DESK_X = 12

const r = (x: number, y: number, w: number, h: number, c: string, cls = ''): string =>
  `<rect${cls ? ` class="${cls}"` : ''} x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}"/>`

// Desk, laptop and mug; the lid's logo blinks and the mug steams only while working.
const desk = (): string =>
  r(9, 15, 12, 7, '#C9CCD2') + r(9, 15, 12, 1, '#E6E8EE') + r(14, 17, 2, 2, ACCENT, 'logo') +
  r(27, 19, 3, 3, '#8E929A') + r(28, 16, 1, 2, '#9A9A96', 'steam') +
  r(0, 22, 30, 2, '#7A4A26') + r(2, 24, 1, 4, '#5A3519') + r(27, 24, 1, 4, '#5A3519')

// Seated behind the laptop with headphones; claws type, eyes read.
const typist = (): string =>
  r(7, 10, 16, 12, CLAY) + r(9, 12, 2, 2, INK, 'eye') + r(19, 12, 2, 2, INK, 'eye') +
  r(8, 8, 14, 1, ACCENT) + r(7, 9, 1, 1, ACCENT) + r(22, 9, 1, 1, ACCENT) + r(5, 10, 2, 5, ACCENT) + r(23, 10, 2, 5, ACCENT) +
  r(4, 18, 4, 3, CLAY, 'hl') + r(22, 18, 4, 3, CLAY, 'hr') + r(9, 24, 2, 2, CLAY) + r(19, 24, 2, 2, CLAY)

// Walking crab, headphones on, standing on the row's floor (the effortless band below).
const walker = (): string =>
  `<g class="bd">${r(7, 10, 16, 12, CLAY) + r(3, 14, 4, 4, CLAY) + r(23, 14, 4, 4, CLAY) + r(9, 12, 2, 2, INK) + r(19, 12, 2, 2, INK) +
    r(8, 8, 14, 1, ACCENT) + r(5, 10, 2, 5, ACCENT) + r(23, 10, 2, 5, ACCENT)}</g>` +
  `<g class="la">${r(7, 22, 2, 4, CLAY) + r(17, 22, 2, 4, CLAY)}</g><g class="lb">${r(11, 22, 2, 4, CLAY) + r(21, 22, 2, 4, CLAY)}</g>`

// The walk runs from beside the desk (pos 0) out to `travel` and back, at WALK units/s.
const WALK = 18
const RUN = 60
// Where the runner stops: on the desk's seat, 36 units left of the walk's start.
const SEAT = -36

const walkOf = (W: number) => {
  const travel = Math.max(0, W / SCALE - 30 - (DESK_X + 36))
  const period = 2 * Math.max(6, Math.round(travel / WALK))
  return { travel, period }
}

// Where the walker is `ms` after it set off from the desk.
export const posAt = (W: number, ms: number): number => {
  const { travel, period } = walkOf(W)
  const u = ((ms / 1000) % period) / period
  return travel * (u < 0.5 ? 2 * u : 2 - 2 * u)
}

// How long the run from `from` to the seat takes, in ms.
export const runMs = (from: number): number => Math.round(((from - SEAT) / RUN) * 1000)

/**
 * The scene `ms` after the last change of state: idle, the walk `ms` in; working,
 * the run back from `from` (where the walker was when work began) and then the typing.
 * Negative delays put each CSS animation where it would be by now, so a redraw never jumps.
 */
export const sceneSvg = (W: number, isWorking: boolean, ms = 0, from = SEAT): string => {
  const { travel, period } = walkOf(W)
  const run = isWorking ? runMs(from) : 0
  const isRunning = ms < run
  const d = (extra = 0) => `${-(ms - extra) / 1000}s`
  const css = `<style>
g{transform-box:fill-box}
.la{animation:st .5s steps(1) infinite}.lb{animation:st .5s steps(1) infinite -.25s}.bd{animation:bob .5s steps(1) infinite -.125s}
.path{animation:walk ${period}s linear infinite ${d()}}.face{transform-origin:center;animation:face ${period}s steps(1) infinite ${d()}}
.run .la{animation-duration:.2s}.run .lb{animation-duration:.2s;animation-delay:-.1s}.run .bd{animation-duration:.2s}
.run .face{transform-origin:center;transform:scaleX(-1);animation:none}
.run .path{animation:dash ${run / 1000}s linear forwards ${d()}}
.w .hl{animation:st .25s steps(1) infinite}.w .hr{animation:st .25s steps(1) infinite -.125s}
.w .eye{animation:read 1s steps(1) infinite}.w .logo{animation:blink 1s steps(1) infinite}.w .steam{animation:steam 1s ease-out infinite}
.idle .steam{display:none}
@keyframes st{50%{transform:translateY(-1px)}}@keyframes bob{50%{transform:translateY(1px)}}
@keyframes read{50%{transform:translateX(1px)}}@keyframes blink{50%{opacity:.15}}@keyframes steam{to{transform:translateY(-3px);opacity:0}}
@keyframes walk{0%{transform:translateX(0)}50%{transform:translateX(${travel}px)}100%{transform:translateX(0)}}
@keyframes face{0%{transform:none}50%{transform:scaleX(-1)}}
@keyframes dash{from{transform:translateX(${from}px)}to{transform:translateX(${SEAT}px)}}
@keyframes sit{from{visibility:hidden}to{visibility:visible}}@keyframes stand{from{visibility:visible}to{visibility:hidden}}
.sit{animation:sit 0s ${(run - ms) / 1000}s both}.stand{animation:stand 0s ${(run - ms) / 1000}s both}
@media (prefers-reduced-motion: reduce){*{animation:none!important}}
</style>`
  const walkerAt = (cls: string) =>
    `<g class="${cls}" transform="translate(${DESK_X + 36},4)"><g class="path"><g class="face">${walker()}</g></g></g>`
  const scene = !isWorking
    ? `<g class="idle" transform="translate(${DESK_X},2)">${desk()}</g>${walkerAt('')}`
    : !isRunning
      ? `<g class="w" transform="translate(${DESK_X},2)">${typist()}${desk()}</g>`
      : // The runner reaches the seat, then swaps for the typist; one string, no redraw needed.
        `<g class="idle stand" transform="translate(${DESK_X},2)">${desk()}</g>${walkerAt('run stand')}` +
        `<g class="w sit" transform="translate(${DESK_X},2)">${typist()}${desk()}</g>`
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" shape-rendering="crispEdges">${css}<g transform="scale(${SCALE})">${scene}</g></svg>`
}

// Hide ponytail's row (the plugin stays on) and put effortless on top, so the desk stands on it.
export const arrange = <R extends { plugin: string }>(rows: readonly R[]): R[] => {
  const rest = rows.filter(row => row.plugin !== 'ponytail')
  const eff = rest.filter(row => row.plugin === 'effortless')
  return [...eff, ...rest.filter(row => row.plugin !== 'effortless')]
}

export const register: Register = on => {
  // When the state last changed, and where the walker was when work began.
  let isWorking: boolean | undefined
  let changedAt = 0
  // The drawing is made once per state and reused: a source that changed on every redraw
  // (other rows redraw the band about once a second) restarted the animation each time.
  let drawnKey = ''
  let drawn = ''
  let from = SEAT

  // The scene is drawn by the list wrapper, flush on the rows: a row of its own would get the band's gap.
  on('ui.render', { component: 'AbovePromptList' }, async ($, e, next) => {
    const below = await next({ ...e, props: { ...e.props, rows: arrange(e.props.rows) } })
    const ui = $.ui.resolve(e)
    // shortcut: drawn only where Svg exists (desktop, mobile); the terminal gets the plain band.
    if (e.props.hasSurvey || e.props.rows.length === 0 || e.surface === 'terminal' || !('Svg' in ui)) return below
    const { Box, Svg } = ui
    const W = Math.max(180, Math.min(1600, (e.props.bodyColumns || 100) * 8 - 16))
    const now = await $.clock.now()
    if (e.props.isWorking !== isWorking) {
      // First draw: no run. Work begins: run back from wherever the walk had got to.
      from = isWorking === false && e.props.isWorking ? posAt(W, now - changedAt) : SEAT
      isWorking = e.props.isWorking
      changedAt = now
    }
    const key = `${W}|${isWorking}|${changedAt}`
    if (key !== drawnKey) {
      drawnKey = key
      drawn = sceneSvg(W, e.props.isWorking, now - changedAt, from)
    }
    return (
      <Box flexDirection="column">
        <Svg
          source={drawn}
          alt={e.props.isWorking ? 'Crab typing at its desk' : 'Crab walking beside its desk'}
          width={W}
          height={H}
        />
        {below}
      </Box>
    )
  })
}
