import asyncio
import sys
from tipsi_tools.python import rel_path
sys.path.append(rel_path('.'))
from poulpe.server import run_server  # noqa


def main():
    run_server()

if __name__ == '__main__':
    main()
