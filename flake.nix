{
  description = "A Nix-flake-based Node.js development environment";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-25.05";
  };

  outputs = {
    self,
    nixpkgs,
    ...
  }: let
    # system should match the system you are running on
    system = "x86_64-linux";
  in {
    devShells."${system}".default = let
      pkgs = import nixpkgs {inherit system;};
    in
      pkgs.mkShell {
        # create an environment with nodejs, pnpm, and yarn
        packages = with pkgs; [
          nodejs_24
          nodePackages.pnpm
          (yarn.override {nodejs = nodejs_24;})
        ];

        shellHook = ''
          echo "node `node --version`"\n
          echo Hello
        '';
      };
  };
}
