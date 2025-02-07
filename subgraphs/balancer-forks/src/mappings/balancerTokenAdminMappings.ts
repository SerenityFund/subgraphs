import { BigDecimal } from "@graphprotocol/graph-ts";
import { MiningParametersUpdated } from "../../generated/BalancerTokenAdmin/BalancerTokenAdmin";
import * as constants from "../common/constants";
import { getOrCreateRewardToken } from "../common/initializers";
import { getRewardsPerDay } from "../common/rewards";

export function handleMiningParametersUpdated(
  event: MiningParametersUpdated
): void {
  let protocolToken = getOrCreateRewardToken(
    constants.PROTOCOL_TOKEN_ADDRESS,
    constants.RewardTokenType.DEPOSIT,
    event.block
  );
  protocolToken._inflationRate = BigDecimal.fromString(
    event.params.rate.toString()
  );
  protocolToken._inflationPerDay = getRewardsPerDay(
    event.block.timestamp,
    event.block.number,
    protocolToken._inflationRate!,
    constants.INFLATION_INTERVAL
  );
  protocolToken.save();
}
