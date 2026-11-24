import { expect, test } from 'claude-code/testing'
import { arrange, posAt, runMs, sceneSvg } from './register'

test('idle: crab walks beside the desk; working: crab types at it', () => {
  expect(sceneSvg(400, false)).toContain('class="path"')
  expect(sceneSvg(400, false)).not.toContain('class="w"')
  expect(sceneSvg(400, true)).toContain('class="w"')
  expect(sceneSvg(400, true)).not.toContain('class="path"')
})

test('work begins far from the desk: the crab runs back, then sits', () => {
  const from = posAt(800, 5000)
  expect(from).toBeGreaterThan(0)
  const run = runMs(from)
  const mid = sceneSvg(800, true, run / 2, from)
  expect(mid).toContain('run stand')
  expect(mid).toContain('w sit')
  expect(mid).toContain(`translateX(${from}px)`)
  const after = sceneSvg(800, true, run + 1, from)
  expect(after).not.toContain('run stand')
  expect(after).toContain('class="w"')
})

test('the walk goes out and back: starts and ends at the desk', () => {
  expect(posAt(800, 0)).toBe(0)
  expect(posAt(800, 1000)).toBeGreaterThan(0)
})

test('ponytail row hidden, effortless first so the desk stands on it', () => {
  const p = (plugin: string) => ({ plugin })
  expect(arrange([p('ponytail'), p('savvy-progress'), p('effortless')]).map(r => r.plugin)).toEqual(['effortless', 'savvy-progress'])
  expect(arrange([p('ponytail')])).toEqual([])
})
