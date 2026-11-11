import React from "react";
import { FragmentedSetup } from "./FragmentedSetup";
import { TransitionConnector } from "./TransitionConnector";
import { ConnectedArchitecture } from "./ConnectedArchitecture";

export function TransformationVisual() {
  return (
    <div className="relative grid grid-cols-1 lg:grid-cols-[38fr_auto_58fr] items-center gap-6 lg:gap-8 xl:gap-10 py-4">
      <div data-os-left-cluster>
        <FragmentedSetup />
      </div>

      <TransitionConnector />

      <div data-os-right-cluster>
        <ConnectedArchitecture />
      </div>
    </div>
  );
}

