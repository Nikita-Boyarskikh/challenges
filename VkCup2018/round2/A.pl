$_ = <>; chomp $_;
my ($l, $r) = split / /;
my @arr = (1,), %h = (1 => 1), $i = 0, $c = 0;
while ($arr[$i] <= $r) {
    if (not $h{$arr[$i] * 2}) {
        push (@arr, $arr[$i] * 2);
        $h{$arr[$i] * 2} = 1;
    }
    if (not $h{$arr[$i] * 3}) {
        push (@arr, $arr[$i] * 3);
        $h{$arr[$i] * 3} = 1;
    }
    $c++ if ($arr[$i] >= $l);
    @arr = sort {$a <=> $b} @arr;
    $i++;
}
print $c;
