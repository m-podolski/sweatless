import { Test, TestingModule } from "@nestjs/testing";
import { LogStatisticsService } from "./log-statistics.service";

describe("LogStatisticsService", () => {
  let service: LogStatisticsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LogStatisticsService],
    }).compile();

    service = module.get<LogStatisticsService>(LogStatisticsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
