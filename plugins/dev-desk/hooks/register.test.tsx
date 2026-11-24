import { expect, test } from 'claude-code/testing'
import { arrange, sceneSvg } from './register'

test('idle: crab walks beside the desk; working: crab types at it', () => {
  expect(sceneSvg(400, false)).toContain('class="path"')
  expect(sceneSvg(400, false)).not.toContain('class="w"')
  expect(sceneSvg(400, true)).toContain('class="w"')
  expect(sceneSvg(400, true)).not.toContain('class="path"')
})

test('ponytail row hidden, effortless first so the desk stands on it', () => {
  const p = (plugin: string) => ({ plugin })
  expect(arrange([p('ponytail'), p('savvy-progress'), p('effortless')]).map(r => r.plugin)).toEqual(['effortless', 'savvy-progress'])
  expect(arrange([p('ponytail')])).toEqual([])
})

