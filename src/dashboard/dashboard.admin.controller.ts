import { Controller } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller()
export class DashboardAdminController {
  constructor(private readonly dashboardService: DashboardService) {}
}
