# claude-crab-desk

Pixel programmer crabs for the Claude Code desktop app.

- **dev-desk**: the main crab gets a desk above the [effortless](https://github.com/HeyCubit/effortless) band. It walks along the band while Claude is idle and types at its laptop while Claude works.
- **savvy-progress** (modified): the agents panel (`/agents-info`) shows each running subagent as a crab coding at a laptop, headphones in its tier's color; finished subagents turn back into the plain crab. A modified copy of [savvy-progress](https://github.com/johnnyvizz/claude-kit) by johnnyvizz, MIT.

## Install

In Claude Code, one line each:

```
/plugin install dev-desk --marketplace teuss96/claude-crab-desk
/plugin install savvy-progress --marketplace teuss96/claude-crab-desk
```

For the desk to stand on the effortless band, install effortless too:

```
/plugin install effortless --marketplace HeyCubit/effortless
```

Then start a new session. Open the agents panel with `/agents-info`.

If you already have the original savvy-progress from `claude-kit`, uninstall it first, or the panel is drawn twice.

## License

dev-desk: MIT, teuss96. savvy-progress: MIT, johnnyvizz, modified here (see its folder).
