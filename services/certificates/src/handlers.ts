import { CommandHandler, ICommandHandler, IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import {
  CreateCertificateCommand,
  DeleteCertificateCommand,
  ListCertificatesQuery,
  UpdateCertificateCommand,
} from "./messages";
import { certStore, type Certificate } from "./store";

@QueryHandler(ListCertificatesQuery)
export class ListCertificatesHandler implements IQueryHandler<ListCertificatesQuery> {
  async execute() {
    return certStore.list();
  }
}

@CommandHandler(CreateCertificateCommand)
export class CreateCertificateHandler implements ICommandHandler<CreateCertificateCommand> {
  async execute(command: CreateCertificateCommand) {
    return certStore.create(command.input as Partial<Certificate>);
  }
}

@CommandHandler(UpdateCertificateCommand)
export class UpdateCertificateHandler implements ICommandHandler<UpdateCertificateCommand> {
  async execute(command: UpdateCertificateCommand) {
    return certStore.update(command.id, command.input as Partial<Certificate>);
  }
}

@CommandHandler(DeleteCertificateCommand)
export class DeleteCertificateHandler implements ICommandHandler<DeleteCertificateCommand> {
  async execute(command: DeleteCertificateCommand) {
    return certStore.remove(command.id);
  }
}

export const Handlers = [
  ListCertificatesHandler,
  CreateCertificateHandler,
  UpdateCertificateHandler,
  DeleteCertificateHandler,
];
