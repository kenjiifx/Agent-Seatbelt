# Policy Packs

Policy packs are prebuilt config presets you can use during initialization.

## Available packs

- `default`
- `strict`
- `ci`
- `startup-dev`
- `open-source-maintainer`
- `production-safe`

## Usage

```bash
seatbelt init --policy-pack production-safe
seatbelt init --policy-pack strict --profile strict
```

## Notes

- Packs are plain YAML and can be customized.
- `--profile` sets `settings.defaultProfile` in generated config.
- Keep production-oriented packs strict by default.
