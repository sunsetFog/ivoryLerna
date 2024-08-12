module.exports = {
  webpack: {
    alias: {
      "@ivory/components": "../components",
    },
    modules: ["node_modules", path.resolve(__dirname, "../")],
  },
  babel: {
    plugins: [
      [
        "module-resolver",
        {
          root: ["../"],
          alias: {
            "@ivory/components": "../components",
          },
        },
      ],
    ],
  },
};
