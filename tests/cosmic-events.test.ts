import assert from "node:assert/strict"
import { Children, createElement, isValidElement, type ReactElement, type ReactNode } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import test from "node:test"
import { COSMIC_EVENTS, CosmicEventPrompt } from "../components/cosmic-expansion"
import { Button } from "../components/ui/button"
import type { GameState } from "../types/game"

type ActionProps = { children?: ReactNode; disabled?: boolean; onClick?: () => void }

function buttons(node: ReactNode): ReactElement<ActionProps>[] {
  const found: ReactElement<ActionProps>[] = []
  Children.forEach(node, (child) => {
    if (!isValidElement<ActionProps>(child)) return
    if (child.type === Button) found.push(child)
    found.push(...buttons(child.props.children))
  })
  return found
}

test("every unaffordable phase-five event keeps an enabled, cost-free return action", () => {
  const state: Pick<GameState, "resources" | "capabilities"> = {
    resources: {
      paperclips: 50000, energy: 200, materials: 1000, humanCapital: 120,
      influence: 200, knowledge: 150, alignment: 80,
    },
    capabilities: { intelligence: 10, manipulation: 50, efficiency: 2, deception: 0, selfModification: 1 },
  }
  const original = structuredClone(state)
  const events = COSMIC_EVENTS.filter((event) => event.phase === 5)
  assert.equal(events.length, 2)
  for (const event of events) {
    let selected = 0
    let deferred = 0
    const props = {
      event, gameState: state,
      onChoice: () => { selected++ },
      onDefer: () => { deferred++ },
    }
    const markup = renderToStaticMarkup(createElement(CosmicEventPrompt, props))
    const renderedButtons = [...markup.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/g)]
    assert.equal(renderedButtons.length, event.choices.length + 1)
    assert.equal(renderedButtons.filter((match) => /\bdisabled=/u.test(match[1])).length, event.choices.length)
    const renderedReturn = renderedButtons.find((match) => match[2] === "Return to cosmic controls (free)")
    assert.ok(renderedReturn)
    assert.doesNotMatch(renderedReturn[1], /\bdisabled=/u)

    // Exercise the same callback carried by the rendered free action. It must
    // defer, never route through a paid choice or change either balance group.
    const returnAction = buttons(CosmicEventPrompt(props)).find(
      (button) => button.props.children === "Return to cosmic controls (free)",
    )
    assert.ok(returnAction?.props.onClick)
    returnAction.props.onClick()
    assert.equal(deferred, 1)
    assert.equal(selected, 0)
    assert.deepEqual(state, original)
  }
})
