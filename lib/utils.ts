import DayjsAdapter from '@date-io/dayjs';
import BigNumber from 'bignumber.js';
import dayjs, { Dayjs } from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import IMask from 'imask';
import { Hex, formatUnits, getAddress } from 'viem';

dayjs.extend(utc);
dayjs.extend(timezone);

export const dayJsAdapter = new DayjsAdapter({
  formats: { normalDate: 'DD MMM YYYY' }, // [UTC]Z
  instance: dayjs,
});
export const formatUnixToDate = (unixTimestamp: bigint | string) => {
  return new Date(
    dayJsAdapter
      .dayjs(Number(unixTimestamp) * 1000)
      .toDate()
      .setHours(0, 0, 0, 0)
  );
};
export const defaultDate = dayjs();
export const getDayDiffs = (
  epoch: string | number,
  dd = defaultDate
): number => {
  const diff = dayJsAdapter.getDiff(
    dayJsAdapter.date(new Date(Number(epoch) * 1000)) as Dayjs,
    dayJsAdapter.date(dd) as Dayjs,
    'days'
  ); // inclusive due date
  return diff === 0 ? 1 : diff;
};
export const currDate = dayJsAdapter.date(defaultDate) as Dayjs;
export const unixTimestampInDays = (count: number): number => {
  return dayJsAdapter
    .addDays(dayJsAdapter.date(new Date()) as Dayjs, count)
    .unix();
};

export const formatNumberInWei = (
  amount: bigint | number | string | undefined,
  decimals = 6
) => {
  if (!amount || !Number(amount)) return '-';
  return formatNumber(
    formatUnits(BigInt(Math.round(Number(amount))), Number(decimals))
  );
};

export const formatABN = (abn: string) => {
  const _maskedABN = IMask.createMask({ mask: '00 000 000 000' });

  _maskedABN.resolve(abn);
  return _maskedABN.value;
};

export const formatNumber = (
  value: number | bigint | string | undefined,
  scale = 2
) => {
  if (!value) return '-';

  const _maskedNumeric = IMask.createMask({
    mask: 'num',
    lazy: true,
    blocks: {
      num: {
        lazy: true,
        mask: Number,
        scale: scale,
        signed: false,
        normalizeZeros: true,
        thousandsSeparator: ',',
        padFractionalZeros: false,
        radix: '.',
        mapToRadix: ['.'],
      },
    },
  });

  _maskedNumeric.resolve(`${value}`);
  return _maskedNumeric.value;
};

export const formatCurrency = (
  value: number | bigint | string | undefined,
  scale = 2
) => {
  if (!value) return '-';

  const _maskedCurrency = IMask.createMask({
    mask: '$num',
    lazy: true,
    blocks: {
      num: {
        lazy: true,
        mask: Number,
        scale: scale,
        signed: false,
        normalizeZeros: true,
        thousandsSeparator: ',',
        padFractionalZeros: false,
        radix: '.',
        mapToRadix: ['.'],
      },
    },
  });

  _maskedCurrency.resolve(`${value}`);
  return _maskedCurrency.value;
};

export const unmaskValue = (value: number | string): number => {
  const strVal = String(value);
  const retVal = strVal.startsWith('$')
    ? strVal.slice(1).replaceAll(',', '')
    : strVal.replaceAll(',', '');
  return Number(retVal);
};

export const BigNumberInstance = BigNumber.clone({
  ROUNDING_MODE: BigNumber.ROUND_HALF_UP,
  DECIMAL_PLACES: 2,
});

// returns the checksummed address if the address is valid, otherwise returns false
export function isAddress(value: Hex | string): string | false {
  try {
    return getAddress(value);
  } catch {
    return false;
  }
}

// shorten the checksummed version of the input address to have 0x + 4 characters at start and end
export function shortenAddress(address: string, chars = 4): string {
  const parsed = isAddress(address);
  if (!parsed) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }
  return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`;
}

export function shortenTxHash(
  txHash: string | Hex | undefined,
  chars = 6
): string {
  if (!txHash) return '';
  return `${txHash.substring(0, chars)}...${txHash.slice(-chars)}`;
}

export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

export function encodeUrlParams(originUrl: string): string {
  if (!originUrl) return '';

  try {
    if (!originUrl.startsWith('http://') && !originUrl.startsWith('https://')) {
      originUrl = `https://${originUrl}`;
    }

    const url = new URL(originUrl);
    return !url.search
      ? originUrl
      : `${url.origin}${url.pathname}?${encodeURIComponent(
          url.searchParams.toString()
        )}}`;
  } catch {
    return originUrl;
  }
}

export const Base64 = {
  encode(str: string) {
    return btoa(
      encodeURIComponent(str).replace(
        /%([0-9A-F]{2})/g,
        function toSolidBytes(_, p1) {
          return String.fromCharCode(('0x' + p1) as unknown as number);
        }
      )
    );
  },
  decode(str: string) {
    return decodeURIComponent(
      atob(str)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
  },
};

export const toBase64 = (svg: string) => {
  const decodedStr = Base64.encode(svg); // btoa(svg);
  return `data:image/svg+xml;base64,${decodedStr}`;
};

export const toggleElement = (arr: string[], val: string) =>
  arr.includes(val) ? arr.filter((el) => el !== val) : [...arr, val];
