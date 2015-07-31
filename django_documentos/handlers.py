from redactor.handlers import UUIDUploader, DateDirectoryUploader


class DateDirectoryWithUUIDUploader(UUIDUploader, DateDirectoryUploader):
    pass
