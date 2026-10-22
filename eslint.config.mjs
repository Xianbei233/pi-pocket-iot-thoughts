import tseslint from "typescript-eslint";

export default tseslint.config(
    {
        ignores: ["node_modules/**", "dist/**", "evidence/**", ".git/**", "_pocket.d.ts"],
    },
    ...tseslint.configs.recommended,
    {
        files: ["iot-thoughts.ts", "test/**/*.ts"],
        rules: {
            "no-console": "error",
            eqeqeq: ["error", "always"],
        },
    },
    {
        files: ["scripts/**/*.mjs", "eslint.config.mjs"],
        rules: {
            "no-console": "off",
        },
    },
);
