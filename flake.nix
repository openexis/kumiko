{
  description = "A reproducible Node.js development environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable"; # Use a specific pin for stability
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs =
    {
      self,
      nixpkgs,
      flake-utils,
    }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = nixpkgs.legacyPackages.${system};

      in
      {
        formatter = pkgs.nixfmt;
        devShells.default = pkgs.mkShell {
          nativeBuildInputs = [ pkgs.deno ];

          packages = with pkgs; [
            alejandra
            nixd
            deadnix
            statix

            self.formatter.${system}
          ];
        };
      }
    );
}
